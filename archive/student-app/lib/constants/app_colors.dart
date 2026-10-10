import 'package:flutter/material.dart';

class AppColors {
  // Brand Primary & Accents
  static const Color primary = Color(0xFFFF5722); // Deep Orange
  static const Color primaryLight = Color(0xFFFF8A65);
  static const Color primaryDark = Color(0xFFE64A19);
  
  static const Color secondary = Color(0xFF0D9488); // Teal
  static const Color accent = Color(0xFFFFB703); // Warm Gold

  // Dietary Indicators
  static const Color veg = Color(0xFF16A34A); // Forest Green
  static const Color nonVeg = Color(0xFFDC2626); // Crimson Red

  // Neutral Colors (Light)
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textLight = Color(0xFF94A3B8);
  static const Color border = Color(0xFFE2E8F0);
  static const Color divider = Color(0xFFF1F5F9);

  // Status & Feedback
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // Status Stepper Specific
  static const Color statusPending = Color(0xFFF59E0B);
  static const Color statusPreparing = Color(0xFF3B82F6);
  static const Color statusReady = Color(0xFF10B981);
  static const Color statusCollected = Color(0xFF64748B);
  static const Color statusCancelled = Color(0xFFEF4444);
}
