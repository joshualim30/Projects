import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:io';
import 'dart:async';

import 'package:morse_code_messenger/screens/conversation.dart';

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> with TickerProviderStateMixin {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Terminal state
  final List<String> _logs = [];
  final ScrollController _scrollController = ScrollController();
  bool _showButton = false;
  bool _isAuthenticating = false;

  @override
  void initState() {
    super.initState();
    _startBootSequence();
  }

  void _addLog(String text) {
    if (!mounted) return;
    setState(() {
      _logs.add('>> $text');
    });
    // Auto-scroll to bottom
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _startBootSequence() async {
    await Future.delayed(const Duration(milliseconds: 500));
    _addLog('INITIALIZING MORSE LINK PROTOCOL...');
    await Future.delayed(const Duration(milliseconds: 800));
    _addLog('CHECKING CRYPTOGRAPHY MODULES... OK');
    await Future.delayed(const Duration(milliseconds: 600));
    _addLog('ESTABLISHING SECURE CHANNEL...');
    await Future.delayed(const Duration(milliseconds: 1000));
    _addLog('READY FOR TRANSMISSION.');

    if (mounted) {
      setState(() {
        _showButton = true;
      });
    }
  }

  Future<void> _initializeUser() async {
    if (_isAuthenticating) return;

    setState(() {
      _isAuthenticating = true;
    });

    _addLog('AUTHENTICATING ANONYMOUS USER...');

    try {
      final userCredential = await _auth.signInAnonymously();
      final user = userCredential.user;

      if (user != null && mounted) {
        _addLog('IDENTITY VERIFIED: [REDACTED]');

        final deviceId = Platform.isIOS ? 'iOS_Unit' : 'Android_Unit';

        try {
          await _firestore.collection('users').doc(user.uid).set({
            'uid': user.uid,
            'deviceId': deviceId,
            'createdAt': FieldValue.serverTimestamp(),
            'lastSeen': FieldValue.serverTimestamp(),
            'isAnonymous': true,
          });
          _addLog('UPLINK ESTABLISHED.');
        } catch (e) {
          _addLog('WARNING: FIRESTORE SYNC FAILED.');
        }

        await Future.delayed(const Duration(milliseconds: 800));

        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const Conversation()),
          );
        }
      }
    } catch (e) {
      _addLog('ERROR: AUTHENTICATION FAILED.');
      _addLog(e.toString());
      if (mounted) {
        setState(() {
          _isAuthenticating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isTerminalGreen = theme.colorScheme.primary;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header / Logo area
              Container(
                padding: const EdgeInsets.symmetric(vertical: 32),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: isTerminalGreen.withValues(alpha: 0.3),
                      width: 2,
                    ),
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.settings_ethernet,
                      size: 64,
                      color: isTerminalGreen,
                    ),
                    const SizedBox(height: 16),
                    Text('M.O.R.S.E.', style: theme.textTheme.displayMedium),
                    Text(
                      'SECURE TERMINAL',
                      style: theme.textTheme.labelLarge?.copyWith(
                        letterSpacing: 4,
                        color: isTerminalGreen.withValues(alpha: 0.7),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Terminal Output
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.3),
                    border: Border.all(
                      color: isTerminalGreen.withValues(alpha: 0.2),
                    ),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: _logs.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(
                          _logs[index],
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontFamily: 'Courier',
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Action Button
              AnimatedOpacity(
                duration: const Duration(milliseconds: 500),
                opacity: _showButton ? 1.0 : 0.0,
                child: _isAuthenticating
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        onPressed: _showButton ? _initializeUser : null,
                        style: ElevatedButton.styleFrom(
                          shape: const BeveledRectangleBorder(), // Tech look
                        ),
                        child: const Text('INITIATE CONNECTION'),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
