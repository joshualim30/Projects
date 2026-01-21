import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MorseTheme {
  static const Color _bgDark = Color(0xFF050505);
  static const Color _surfaceDark = Color(0xFF121212);
  static const Color _surfaceLighter = Color(0xFF1E1E1E);
  static const Color _neonGreen = Color(0xFF00FF41);
  static const Color _neonCyan = Color(0xFF00F3FF);
  static const Color _errorRed = Color(0xFFFF003C);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: _bgDark,
      colorScheme: const ColorScheme.dark(
        primary: _neonGreen,
        onPrimary: Colors.black,
        secondary: _neonCyan,
        onSecondary: Colors.black,
        surface: _surfaceDark,
        onSurface: _neonGreen, // Intentionally green text for terminal feel
        error: _errorRed,
        onError: Colors.black,
        primaryContainer: _surfaceLighter,
        onPrimaryContainer: _neonGreen,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.orbitron(
          color: _neonGreen,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
        ),
        displayMedium: GoogleFonts.orbitron(
          color: _neonGreen,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
        ),
        headlineLarge: GoogleFonts.orbitron(
          color: _neonGreen,
          fontWeight: FontWeight.bold,
        ),
        titleLarge: GoogleFonts.orbitron(
          color: _neonGreen,
          fontWeight: FontWeight.w500,
        ),
        bodyLarge: GoogleFonts.robotoMono(color: _neonGreen, fontSize: 16),
        bodyMedium: GoogleFonts.robotoMono(
          color: _neonGreen.withValues(alpha: 0.8),
          fontSize: 14,
        ),
        labelLarge: GoogleFonts.orbitron(
          color: Colors.black,
          fontWeight: FontWeight.bold,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: _bgDark,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.orbitron(
          color: _neonGreen,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: 2.0,
        ),
        iconTheme: const IconThemeData(color: _neonGreen),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _neonGreen,
          foregroundColor: Colors.black,
          elevation: 5,
          shadowColor: _neonGreen.withValues(alpha: 0.5),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4), // Sharp corners
          ),
          textStyle: GoogleFonts.orbitron(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.0,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: _surfaceDark,
        border: OutlineInputBorder(
          borderSide: BorderSide(color: _neonGreen.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(4),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: _neonGreen.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(4),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: _neonGreen, width: 2),
          borderRadius: BorderRadius.circular(4),
        ),
        hintStyle: GoogleFonts.robotoMono(
          color: _neonGreen.withValues(alpha: 0.4),
        ),
        labelStyle: GoogleFonts.orbitron(color: _neonGreen),
      ),
      iconTheme: const IconThemeData(color: _neonGreen, size: 24),
      dividerColor: _neonGreen.withValues(alpha: 0.2),
    );
  }
}
