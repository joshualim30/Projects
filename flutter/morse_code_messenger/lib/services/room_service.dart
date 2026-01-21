// room_service.dart

import 'package:flutter/foundation.dart';
import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class RoomService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // Generate a random room code
  static String generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final random = Random();
    return String.fromCharCodes(
      Iterable.generate(
        6,
        (_) => chars.codeUnitAt(random.nextInt(chars.length)),
      ),
    );
  }

  // Create a new room for the current user
  static Future<String?> createRoom() async {
    final user = _auth.currentUser;
    if (user == null) return null;

    try {
      // Delete any existing rooms for this user first
      await deleteUserRoom(user.uid);

      final roomCode = generateRoomCode();

      await _firestore.collection('rooms').doc(roomCode).set({
        'code': roomCode,
        'hostId': user.uid,
        'participantId': null,
        'createdAt': FieldValue.serverTimestamp(),
        'isActive': true,
        'lastActivity': FieldValue.serverTimestamp(),
      });

      return roomCode;
    } catch (e) {
      debugPrint('Error creating room: $e');
      return null;
    }
  }

  // Join an existing room
  static Future<bool> joinRoom(String roomCode) async {
    final user = _auth.currentUser;
    if (user == null) return false;

    try {
      // Delete any existing rooms for this user first
      await deleteUserRoom(user.uid);

      final roomDoc = await _firestore.collection('rooms').doc(roomCode).get();

      if (!roomDoc.exists) {
        return false; // Room doesn't exist
      }

      final data = roomDoc.data()!;

      // Check if room is full
      if (data['participantId'] != null) {
        return false; // Room is full
      }

      // Check if user is trying to join their own room
      if (data['hostId'] == user.uid) {
        return false; // Can't join own room
      }

      // Join the room
      await _firestore.collection('rooms').doc(roomCode).update({
        'participantId': user.uid,
        'lastActivity': FieldValue.serverTimestamp(),
      });

      return true;
    } catch (e) {
      debugPrint('Error joining room: $e');
      return false;
    }
  }

  // Leave the current room
  static Future<void> leaveRoom(String roomCode) async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      final roomDoc = await _firestore.collection('rooms').doc(roomCode).get();

      if (!roomDoc.exists) return;

      final data = roomDoc.data()!;

      // If user is the host, delete the room
      if (data['hostId'] == user.uid) {
        await _firestore.collection('rooms').doc(roomCode).delete();
        // Also delete all messages in this room
        await deleteRoomMessages(roomCode);
      } else if (data['participantId'] == user.uid) {
        // If user is participant, just remove them
        await _firestore.collection('rooms').doc(roomCode).update({
          'participantId': null,
          'lastActivity': FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      debugPrint('Error leaving room: $e');
    }
  }

  // Delete all rooms where user is host or participant
  static Future<void> deleteUserRoom(String userId) async {
    try {
      // Find rooms where user is host
      final hostRooms = await _firestore
          .collection('rooms')
          .where('hostId', isEqualTo: userId)
          .get();

      for (final doc in hostRooms.docs) {
        await doc.reference.delete();
        await deleteRoomMessages(doc.id);
      }

      // Find rooms where user is participant
      final participantRooms = await _firestore
          .collection('rooms')
          .where('participantId', isEqualTo: userId)
          .get();

      for (final doc in participantRooms.docs) {
        await doc.reference.update({
          'participantId': null,
          'lastActivity': FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      debugPrint('Error deleting user rooms: $e');
    }
  }

  // Delete all messages in a room
  static Future<void> deleteRoomMessages(String roomCode) async {
    try {
      final messages = await _firestore
          .collection('rooms')
          .doc(roomCode)
          .collection('messages')
          .get();

      for (final doc in messages.docs) {
        await doc.reference.delete();
      }
    } catch (e) {
      debugPrint('Error deleting room messages: $e');
    }
  }

  // Send a message to the room
  static Future<void> sendMessage(
    String roomCode,
    String message,
    List<String> morseSignals,
  ) async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      await _firestore
          .collection('rooms')
          .doc(roomCode)
          .collection('messages')
          .add({
            'senderId': user.uid,
            'message': message,
            'morseSignals': morseSignals,
            'timestamp': FieldValue.serverTimestamp(),
          });

      // Update room activity
      await _firestore.collection('rooms').doc(roomCode).update({
        'lastActivity': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      debugPrint('Error sending message: $e');
    }
  }

  // Get room stream
  static Stream<DocumentSnapshot> getRoomStream(String roomCode) {
    return _firestore.collection('rooms').doc(roomCode).snapshots();
  }

  // Get messages stream
  static Stream<QuerySnapshot> getMessagesStream(String roomCode) {
    return _firestore
        .collection('rooms')
        .doc(roomCode)
        .collection('messages')
        .orderBy('timestamp', descending: false)
        .snapshots();
  }

  // Check if user is in any room
  static Future<String?> getCurrentUserRoom() async {
    final user = _auth.currentUser;
    if (user == null) return null;

    try {
      // Check if user is host
      final hostRooms = await _firestore
          .collection('rooms')
          .where('hostId', isEqualTo: user.uid)
          .limit(1)
          .get();

      if (hostRooms.docs.isNotEmpty) {
        return hostRooms.docs.first.id;
      }

      // Check if user is participant
      final participantRooms = await _firestore
          .collection('rooms')
          .where('participantId', isEqualTo: user.uid)
          .limit(1)
          .get();

      if (participantRooms.docs.isNotEmpty) {
        return participantRooms.docs.first.id;
      }

      return null;
    } catch (e) {
      debugPrint('Error getting current user room: $e');
      return null;
    }
  }
}
