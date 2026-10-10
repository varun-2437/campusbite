import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../models/order_model.dart';

class OrderStatusStepper extends StatelessWidget {
  final OrderStatus currentStatus;

  const OrderStatusStepper({super.key, required this.currentStatus});

  int get _currentIndex {
    switch (currentStatus) {
      case OrderStatus.pending:
        return 0;
      case OrderStatus.preparing:
        return 1;
      case OrderStatus.ready:
        return 2;
      case OrderStatus.collected:
        return 3;
      case OrderStatus.cancelled:
        return -1;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (currentStatus == OrderStatus.cancelled) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.error.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.error.withOpacity(0.3)),
        ),
        child: const Row(
          children: [
            Icon(Icons.cancel_rounded, color: AppColors.error, size: 28),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Order Cancelled',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.error,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'This order has been cancelled and refunded.',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ],
        ),
      );
    }

    final steps = [
      {'title': 'Confirmed', 'subtitle': 'Order placed', 'icon': Icons.check_circle_outline},
      {'title': 'Preparing', 'subtitle': 'Chef is cooking', 'icon': Icons.outdoor_grill_outlined},
      {'title': 'Ready', 'subtitle': 'Pickup at counter', 'icon': Icons.notifications_active_outlined},
      {'title': 'Collected', 'subtitle': 'Handed over', 'icon': Icons.celebration_outlined},
    ];

    return Column(
      children: List.generate(steps.length, (index) {
        final isDone = _currentIndex > index;
        final isCurrent = _currentIndex == index;
        final isPending = _currentIndex < index;

        final Color stepColor = isDone
            ? AppColors.success
            : isCurrent
                ? AppColors.primary
                : AppColors.border;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Indicator Column
            Column(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: isDone
                        ? AppColors.success
                        : isCurrent
                            ? AppColors.primary
                            : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: stepColor,
                      width: 2,
                    ),
                    boxShadow: isCurrent
                        ? [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.35),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ]
                        : null,
                  ),
                  child: Center(
                    child: isDone
                        ? const Icon(Icons.check, size: 20, color: Colors.white)
                        : Icon(
                            steps[index]['icon'] as IconData,
                            size: 18,
                            color: isCurrent ? Colors.white : AppColors.textLight,
                          ),
                  ),
                ),
                if (index < steps.length - 1)
                  Container(
                    width: 2.5,
                    height: 38,
                    color: isDone ? AppColors.success : AppColors.border,
                  ),
              ],
            ),
            const SizedBox(width: 14),

            // Text Description
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          steps[index]['title'] as String,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: isCurrent ? FontWeight.bold : FontWeight.w600,
                            color: isPending ? AppColors.textLight : AppColors.textPrimary,
                          ),
                        ),
                        if (isCurrent) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              'In Progress',
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      steps[index]['subtitle'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        color: isPending ? AppColors.textLight : AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
