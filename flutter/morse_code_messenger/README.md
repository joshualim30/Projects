# Morse Code Messenger

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A secure, terminal-style messaging application that communicates purely through Morse code signals and haptic feedback.

## Features

### Secure Room System
- **Ephemeral Connections**: Generate a secure, temporary room code to establish a private link.
- **Direct Link**: Share your unique code with a partner to initiate a secure handshake.
- **Zero-Trace**: Rooms and messages are designed to be transient.

### Terminal Interface
- **Cyberpunk Aesthetic**: High-contrast, dark-mode UI inspired by retro terminals and secure communication uplinks.
- **Visual Feedback**: Real-time visualization of dot/dash input and reception.

### Haptic Communication
- **Tactile Messaging**: Feel the messages you receive. The app translates incoming Morse code into distinct vibration patterns.
- **Tuned Feedback**: Optimized haptic timing for easier interpretation:
  - **Dot**: Short, sharp vibration (200ms)
  - **Dash**: Long, sustained vibration (600ms)
  - **Delays**: Distinct pausing between signals and letters for clarity.

### Telegraph Input
- **Single-Button Interface**: A large, responsive telegraph key for tapping out your messages.
- **Smart Timing**: Automatically distinguishes between dots and dashes based on tap duration (< 200ms = dot).
- **Auto-Send**: Improves flow by automatically grouping signals into characters and sending after a brief pause.

## Getting Started

1. **Launch the App**: Open Morse Code Messenger on your device.
2. **Connect**: 
   - Share your displayed **ACCESS CODE** with a friend.
   - Or, enter their code in the "Target Code" field and tap **INITIATE HANDSHAKE**.
3. **Communicate**:
   - Tap the telegraph key to input Morse code.
   - Short tap = Dot (.)
   - Long press = Dash (-)
   - Messages are decoded and sent automatically.
4. **Receive**:
   - Watch the terminal stream for incoming messages.
   - Feel the phone vibrate to read the message silently.

## Tech Stack
- **Flutter**: Cross-platform UI toolkit.
- **Firebase Firestore**: Real-time signaling and message transport.
- **Vibration**: Hardware integration for haptic feedback.
