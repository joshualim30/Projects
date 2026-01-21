// morse_decoder.dart

import 'dart:async';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter/foundation.dart';

class MorseDecoder {
  static Map<String, String>? _morseToChar;
  static Map<String, String>? _charToMorse;

  // Initialize the decoder by loading morse code data
  static Future<void> initialize() async {
    if (_morseToChar != null && _charToMorse != null) return;

    try {
      final String jsonString = await rootBundle.loadString(
        'assets/morse_code.json',
      );
      final List<dynamic> morseData = json.decode(jsonString);

      _morseToChar = {};
      _charToMorse = {};

      for (final item in morseData) {
        final char = item['character'] as String;
        final morse = item['morse'] as String;
        _morseToChar![morse] = char;
        _charToMorse![char.toUpperCase()] = morse;
      }
    } catch (e) {
      debugPrint('Error loading morse code data: $e');
      _morseToChar = {};
      _charToMorse = {};
    }
  }

  // Decode morse code signals to text
  static String decodeMorse(List<String> signals) {
    if (_morseToChar == null) return '';

    final List<String> words = [];
    final List<String> currentWord = [];

    for (final signal in signals) {
      if (signal.isEmpty) {
        // Empty signal represents space between words
        if (currentWord.isNotEmpty) {
          words.add(currentWord.join(''));
          currentWord.clear();
        }
      } else {
        // Decode morse signal to character
        final char = _morseToChar![signal] ?? '?';
        currentWord.add(char);
      }
    }

    // Add the last word if any
    if (currentWord.isNotEmpty) {
      words.add(currentWord.join(''));
    }

    return words.join(' ');
  }

  // Encode text to morse code
  static List<String> encodeToMorse(String text) {
    if (_charToMorse == null) return [];

    final List<String> signals = [];
    final words = text.toUpperCase().split(' ');

    for (int i = 0; i < words.length; i++) {
      final word = words[i];
      for (final char in word.split('')) {
        final morse = _charToMorse![char];
        if (morse != null) {
          signals.add(morse);
        }
      }

      // Add space between words (except for the last word)
      if (i < words.length - 1) {
        signals.add('');
      }
    }

    return signals;
  }

  // Convert timing-based input to morse signals
  static List<String> timingToMorse(List<int> timings) {
    if (timings.isEmpty) return [];

    // Analyze timings to determine dots, dashes, and spaces
    final List<String> signals = [];
    final List<String> currentSignal = [];

    // Simple threshold-based approach
    // You can adjust these thresholds based on testing
    const int dotThreshold = 200; // ms
    const int dashThreshold = 600; // ms
    const int spaceThreshold = 1000; // ms

    for (int i = 0; i < timings.length; i += 2) {
      final pressDuration = timings[i];
      final pauseDuration = i + 1 < timings.length ? timings[i + 1] : 0;

      // Determine if it's a dot or dash
      if (pressDuration <= dotThreshold) {
        currentSignal.add('.');
      } else if (pressDuration <= dashThreshold) {
        currentSignal.add('-');
      }

      // Determine spacing
      if (pauseDuration >= spaceThreshold || i + 1 >= timings.length) {
        // End of character or word
        if (currentSignal.isNotEmpty) {
          signals.add(currentSignal.join(''));
          currentSignal.clear();
        }

        // If pause is very long, add word space
        if (pauseDuration >= spaceThreshold * 2) {
          signals.add('');
        }
      }
    }

    return signals;
  }

  // Get morse code for a character (for display purposes)
  static String? getMorseForChar(String char) {
    return _charToMorse?[char.toUpperCase()];
  }

  // Get character for morse code (for display purposes)
  static String? getCharForMorse(String morse) {
    return _morseToChar?[morse];
  }
}
