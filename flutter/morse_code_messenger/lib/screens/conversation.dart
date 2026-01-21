// conversation.dart

// MARK: Imports
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:vibration/vibration.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';
import 'package:google_fonts/google_fonts.dart';

// MARK: Local Imports
import 'package:morse_code_messenger/utils/morse_decoder.dart';
import 'package:morse_code_messenger/services/room_service.dart';

// MARK: Conversation
class Conversation extends StatefulWidget {
  const Conversation({super.key});

  @override
  State<Conversation> createState() => _ConversationState();
}

class _ConversationState extends State<Conversation>
    with TickerProviderStateMixin {
  // Connection state
  bool _isConnected = false;
  String? _currentRoomCode;

  // Morse code input
  final List<String> _currentMorseSignals = [];
  final List<int> _inputTimings = [];
  DateTime? _lastInputTime;
  Timer? _inputTimer;

  // Messages
  final List<Map<String, dynamic>> _messages = [];
  final ScrollController _scrollController = ScrollController();

  // Controllers
  final TextEditingController _roomCodeController = TextEditingController();

  // Streams
  StreamSubscription? _roomSubscription;
  StreamSubscription? _messagesSubscription;

  // User info
  User? _user;

  // Visual effects
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _initializeConversation();
  }

  @override
  void dispose() {
    _inputTimer?.cancel();
    _roomSubscription?.cancel();
    _messagesSubscription?.cancel();
    _roomCodeController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _initializeConversation() async {
    await MorseDecoder.initialize();
    _user = FirebaseAuth.instance.currentUser;

    final currentRoom = await RoomService.getCurrentUserRoom();
    if (currentRoom != null && mounted) {
      setState(() {
        _currentRoomCode = currentRoom;
        _isConnected = true;
      });
      _setupRoomListeners();
    } else if (mounted) {
      // Create a new room automatically used to be the default,
      // but maybe we want to let them choose?
      // For now keeping existing logic: auto-create if not in one.
      await _createNewRoom();
    }
  }

  Future<void> _createNewRoom() async {
    final roomCode = await RoomService.createRoom();
    if (roomCode != null && mounted) {
      setState(() {
        _currentRoomCode = roomCode;
        _isConnected = false; // Waiting for partner
      });
      _setupRoomListeners();
    }
  }

  void _setupRoomListeners() {
    if (_currentRoomCode == null) return;

    _roomSubscription = RoomService.getRoomStream(_currentRoomCode!).listen((
      snapshot,
    ) {
      if (!snapshot.exists) {
        _disconnect();
        return;
      }

      final data = snapshot.data() as Map<String, dynamic>;
      final hostId = data['hostId'] as String?;
      final participantId = data['participantId'] as String?;

      if (mounted) {
        setState(() {
          _isConnected = hostId != null && participantId != null;
        });
      }
    });

    _messagesSubscription = RoomService.getMessagesStream(_currentRoomCode!)
        .listen((snapshot) {
          final messages = snapshot.docs.map((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return {
              'id': doc.id,
              'senderId': data['senderId'],
              'message': data['message'],
              'morseSignals': List<String>.from(data['morseSignals'] ?? []),
              'timestamp': data['timestamp'],
              'isOwn': data['senderId'] == _user?.uid,
            };
          }).toList();

          if (mounted) {
            setState(() {
              _messages.clear();
              _messages.addAll(messages);
            });

            // Scroll to bottom
            if (_scrollController.hasClients) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                _scrollController.animateTo(
                  _scrollController.position.maxScrollExtent,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut,
                );
              });
            }

            if (messages.isNotEmpty) {
              final lastMessage = messages.last;
              if (!lastMessage['isOwn'] &&
                  lastMessage['morseSignals'].isNotEmpty) {
                _playMorseVibration(
                  List<String>.from(lastMessage['morseSignals']),
                );
              }
            }
          }
        });
  }

  void _playMorseVibration(List<String> morseSignals) async {
    if (await Vibration.hasVibrator()) {
      for (final signal in morseSignals) {
        for (final char in signal.split('')) {
          if (char == '.') {
            await Vibration.vibrate(duration: 200);
            await Future.delayed(const Duration(milliseconds: 300));
          } else if (char == '-') {
            await Vibration.vibrate(duration: 600);
            await Future.delayed(const Duration(milliseconds: 300));
          }
        }
        await Future.delayed(const Duration(milliseconds: 800));
      }
    }
  }

  // MARK: UI Construction
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // App bar is minimal in this theme
      appBar: AppBar(
        title: Text(
          _isConnected
              ? 'SECURE LINK: $_currentRoomCode'
              : 'WAITING FOR CONNECTION...',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 16),
        ),
        actions: [
          if (_isConnected)
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: _disconnect,
              tooltip: 'TERMINATE CONNECTION',
            ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.3),
            height: 1,
          ),
        ),
      ),
      body: Column(
        children: [
          // Connection Status Area (if not connected)
          if (!_isConnected) _buildConnectionPanel(),

          // Chat Stream
          Expanded(
            child: _isConnected ? _buildChatStream() : const SizedBox.shrink(),
          ),

          // Current Input Display
          if (_isConnected) _buildInputDisplay(),

          // Keypad Area
          if (_isConnected) _buildTelegraphKey(),
        ],
      ),
    );
  }

  Widget _buildConnectionPanel() {
    final colorScheme = Theme.of(context).colorScheme;
    return Expanded(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  border: Border.all(color: colorScheme.primary),
                  color: colorScheme.surface,
                  boxShadow: [
                    BoxShadow(
                      color: colorScheme.primary.withValues(alpha: 0.2),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      'YOUR ACCESS CODE',
                      style: GoogleFonts.robotoMono(
                        color: colorScheme.primary.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _currentRoomCode ?? 'GENERATING...',
                      style: GoogleFonts.orbitron(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: colorScheme.primary,
                        letterSpacing: 4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 48),
              Text(
                '// ESTABLISH REMOTE LINK',
                style: GoogleFonts.robotoMono(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _roomCodeController,
                textAlign: TextAlign.center,
                style: GoogleFonts.orbitron(
                  fontSize: 24,
                  color: colorScheme.secondary,
                  letterSpacing: 2,
                ),
                decoration: InputDecoration(
                  hintText: 'ENTER TARGET CODE',
                  hintStyle: GoogleFonts.orbitron(
                    fontSize: 16,
                    color: colorScheme.secondary.withValues(alpha: 0.3),
                  ),
                ),
                textCapitalization: TextCapitalization.characters,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _joinRoom,
                child: const Text('INITIATE HANDSHAKE'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatStream() {
    return Container(
      color: Colors.black, // Deep black background for chat
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        itemCount: _messages.length,
        itemBuilder: (context, index) {
          final message = _messages[index];
          return _buildTerminalMessage(message);
        },
      ),
    );
  }

  Widget _buildTerminalMessage(Map<String, dynamic> message) {
    final isOwn = message['isOwn'] as bool;
    final colorScheme = Theme.of(context).colorScheme;
    final primaryColor = isOwn ? colorScheme.primary : colorScheme.secondary;
    final align = isOwn ? CrossAxisAlignment.end : CrossAxisAlignment.start;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: align,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                isOwn ? '[TX] >> ' : '[RX] << ',
                style: GoogleFonts.robotoMono(
                  color: primaryColor.withValues(alpha: 0.5),
                  fontSize: 10,
                ),
              ),
              Text(
                (message['morseSignals'] as List).join(' '),
                style: GoogleFonts.robotoMono(
                  color: primaryColor.withValues(alpha: 0.8),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: primaryColor.withValues(alpha: 0.1),
              border: Border.all(
                color: primaryColor.withValues(alpha: 0.3),
                width: 1,
              ),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(12),
                topRight: const Radius.circular(12),
                bottomLeft: isOwn
                    ? const Radius.circular(12)
                    : const Radius.circular(0),
                bottomRight: isOwn
                    ? const Radius.circular(0)
                    : const Radius.circular(12),
              ),
            ),
            child: Text(
              message['message'],
              style: GoogleFonts.orbitron(
                color: primaryColor,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputDisplay() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2),
          ),
        ),
      ),
      child: Column(
        children: [
          Text(
            _currentMorseSignals.isEmpty
                ? 'READY'
                : _currentMorseSignals.join(' '),
            style: GoogleFonts.robotoMono(
              fontSize: 24,
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          // Live decoding preview could go here
        ],
      ),
    );
  }

  Widget _buildTelegraphKey() {
    final colorScheme = Theme.of(context).colorScheme;

    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        height: 200,
        width: double.infinity,
        decoration: BoxDecoration(
          color: _isPressed
              ? colorScheme.primary.withValues(alpha: 0.3)
              : colorScheme.surface,
          border: Border(top: BorderSide(color: colorScheme.primary, width: 2)),
          boxShadow: _isPressed
              ? [
                  BoxShadow(
                    color: colorScheme.primary.withValues(alpha: 0.4),
                    blurRadius: 30,
                    spreadRadius: 5,
                  ),
                ]
              : [],
        ),
        child: Center(
          child: Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: colorScheme.primary.withValues(
                  alpha: _isPressed ? 1.0 : 0.5,
                ),
                width: 4,
              ),
              color: _isPressed ? colorScheme.primary : Colors.transparent,
            ),
            child: Icon(
              Icons.touch_app,
              size: 48,
              color: _isPressed ? colorScheme.onPrimary : colorScheme.primary,
            ),
          ),
        ),
      ),
    );
  }

  // MARK: Input Logic

  void _onTapDown(TapDownDetails details) {
    if (!_isConnected) return;

    setState(() => _isPressed = true);

    _lastInputTime = DateTime.now();
    _inputTimer?.cancel();

    Vibration.vibrate(duration: 50);
  }

  void _onTapUp(TapUpDetails details) {
    if (!_isConnected || _lastInputTime == null) return;

    setState(() => _isPressed = false);

    final duration = DateTime.now().difference(_lastInputTime!).inMilliseconds;
    _inputTimings.add(duration);

    final signal = duration < 200 ? '.' : '-';

    setState(() {
      if (_currentMorseSignals.isEmpty) {
        _currentMorseSignals.add(signal);
      } else {
        // Logic to determine if we should append to last char or start new char
        // For now, simpler implementation: just append to last string in list
        // wait actually, let's keep it simple: List of strings where each string is a character
        // But the user is tapping... how do we know when character ends?
        // In standard morse: space between parts of same letter is short.

        // If this is the very first tap of a new character/word, add new entry
        // If it's a sequence, append.
        // Let's rely on the timer to determine 'new character'.
        // So always append to the last element of the list unless it's a new list
        if (_currentMorseSignals.isEmpty) {
          _currentMorseSignals.add(signal);
        } else {
          _currentMorseSignals[_currentMorseSignals.length - 1] += signal;
        }
      }
    });

    // Timer to determine end of character
    _inputTimer = Timer(const Duration(milliseconds: 600), () {
      _finalizeCurrentCharacter();
    });
  }

  void _finalizeCurrentCharacter() {
    // 600ms passed since last tap. This character is done.
    // Move to next slot.
    if (mounted) {
      setState(() {
        _currentMorseSignals.add(''); // Add placeholder for next char
      });

      // Start timer for message send (end of word/message)
      _inputTimer = Timer(const Duration(milliseconds: 2000), () {
        _sendCurrentMessage();
      });
    }
  }

  void _onTapCancel() {
    setState(() => _isPressed = false);
    _onTapUp(
      TapUpDetails(globalPosition: Offset.zero, kind: PointerDeviceKind.touch),
    );
  }

  void _sendCurrentMessage() async {
    if (_currentMorseSignals.isEmpty || _currentRoomCode == null) return;

    final signals = _currentMorseSignals.where((s) => s.isNotEmpty).toList();
    if (signals.isEmpty) return;

    final decodedMessage = MorseDecoder.decodeMorse(signals);

    if (decodedMessage.trim().isEmpty) {
      // Just noise
      if (mounted) setState(() => _currentMorseSignals.clear());
      return;
    }

    await RoomService.sendMessage(_currentRoomCode!, decodedMessage, signals);

    if (mounted) {
      setState(() {
        _currentMorseSignals.clear();
        _inputTimings.clear();
      });
    }
  }

  // Room management
  Future<void> _joinRoom() async {
    final roomCode = _roomCodeController.text.trim().toUpperCase();
    if (roomCode.isEmpty) return;

    // Show loading? for now just await
    final success = await RoomService.joinRoom(roomCode);
    if (success) {
      if (mounted) {
        setState(() {
          _currentRoomCode = roomCode;
        });
      }
      _setupRoomListeners();
      _roomCodeController.clear();
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'CONNECTION FAILED: INVALID CODE',
              style: GoogleFonts.orbitron(),
            ),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    }
  }

  Future<void> _disconnect() async {
    if (_currentRoomCode != null) {
      await RoomService.leaveRoom(_currentRoomCode!);
    }

    _roomSubscription?.cancel();
    _messagesSubscription?.cancel();

    if (mounted) {
      setState(() {
        _isConnected = false;
        _currentRoomCode = null;
        _messages.clear();
        _currentMorseSignals.clear();
        _inputTimings.clear();
      });
    }

    await _createNewRoom();
  }
}
