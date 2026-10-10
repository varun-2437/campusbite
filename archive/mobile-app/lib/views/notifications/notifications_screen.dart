import 'package:flutter/material.dart';
import '../../config/constants.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final alerts = [
      {
        'title': 'Food is Ready for Pickup! 🔔',
        'desc': 'Token TK-101 is waiting at the counter.',
        'time': '12 mins ago',
        'isNew': true,
      },
      {
        'title': 'Payment Confirmed (Online)',
        'desc': 'Razorpay payment of ₹185 received for ORD-101.',
        'time': '25 mins ago',
        'isNew': false,
      },
      {
        'title': 'Weekly 20% Off Coupon Active',
        'desc': 'Use code CAMPUS20 on any food item above ₹100.',
        'time': 'Yesterday',
        'isNew': false,
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('Notification Alerts', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: alerts.length,
        itemBuilder: (context, idx) {
          final alert = alerts[idx];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: (alert['isNew'] as bool) ? AppColors.primary.withOpacity(0.5) : AppColors.surfaceLight),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.notifications_active, color: AppColors.primary, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(alert['title'] as String, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 4),
                      Text(alert['desc'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                      const SizedBox(height: 6),
                      Text(alert['time'] as String, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                    ],
                  ),
                )
              ],
            ),
          );
        },
      ),
    );
  }
}
