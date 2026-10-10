import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFFF97316); // Warm orange
  static const Color primaryDark = Color(0xFFEA580C);
  static const Color primaryLight = Color(0xFFFFEDD5);

  static const Color background = Color(0xFF0F172A); // Dark navy
  static const Color surface = Color(0xFF1E293B);
  static const Color surfaceLight = Color(0xFF334155);

  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color danger = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
}

class AppConstants {
  static const String appName = 'CampusBite';
  static const String apiBaseUrl = 'http://10.0.2.2:5000/api'; // Android emulator localhost
  static const String socketUrl = 'http://10.0.2.2:5000';
}
