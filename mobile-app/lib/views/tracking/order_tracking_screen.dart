import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../config/constants.dart';
import '../../models/models.dart';
import '../../providers/order_provider.dart';

class OrderTrackingScreen extends StatelessWidget {
  const OrderTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final orderProv = Provider.of<OrderProvider>(context);
    final activeOrder = orderProv.activeOrder ?? orderProv.orders.first;

    final steps = ['Pending', 'Preparing', 'Ready', 'Collected'];
    final currentStepIndex = steps.indexOf(activeOrder.status);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('Live Order Tracking', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Token & QR Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.surfaceLight),
              ),
              child: Column(
                children: [
                  const Text('Show this QR or Token at pickup counter', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  const SizedBox(height: 12),
                  Text(
                    activeOrder.tokenNumber,
                    style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: AppColors.primary, letterSpacing: 2),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                    child: QrImageView(
                      data: 'CAMPUSBITE-${activeOrder.orderId}-${activeOrder.tokenNumber}',
                      version: QrVersions.auto,
                      size: 160.0,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text('Order ID: ${activeOrder.orderId}', style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  Text('Estimated pickup ready time: ~8 mins', style: const TextStyle(color: AppColors.warning, fontWeight: FontWeight.w600, fontSize: 13)),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Live Stepper
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.surfaceLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Preparation Status', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 20),
                  _buildStepRow('Order Confirmed', 'Kitchen received order ticket', currentStepIndex >= 0, isCurrent: currentStepIndex == 0),
                  _buildStepDivider(currentStepIndex >= 1),
                  _buildStepRow('Cooking & Preparing', 'Fresh meal being cooked', currentStepIndex >= 1, isCurrent: currentStepIndex == 1),
                  _buildStepDivider(currentStepIndex >= 2),
                  _buildStepRow('Ready for Pickup', 'Proceed to serving counter', currentStepIndex >= 2, isCurrent: currentStepIndex == 2),
                  _buildStepDivider(currentStepIndex >= 3),
                  _buildStepRow('Collected', 'Handover confirmed', currentStepIndex >= 3, isCurrent: currentStepIndex == 3),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Demo status simulator button for live testing
            if (activeOrder.status != 'Collected')
              TextButton(
                onPressed: () {
                  final nextStatus = currentStepIndex < 3 ? steps[currentStepIndex + 1] : 'Collected';
                  orderProv.updateOrderStatus(activeOrder.orderId, nextStatus);
                  if (nextStatus == 'Collected') {
                    Navigator.pushNamed(context, '/feedback', arguments: activeOrder.orderId);
                  }
                },
                child: const Text('Simulate Next Status Update (Demo) →', style: TextStyle(color: AppColors.primary, fontSize: 12)),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepRow(String title, String subtitle, bool isDone, {bool isCurrent = false}) {
    return Row(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: isDone ? AppColors.primary : AppColors.surfaceLight,
            shape: BoxShape.circle,
            border: isCurrent ? Border.all(color: Colors.white, width: 2) : null,
          ),
          child: Icon(
            isDone ? Icons.check : Icons.circle,
            color: Colors.white,
            size: 16,
          ),
        ),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: isDone ? AppColors.textPrimary : AppColors.textMuted,
                fontWeight: isDone ? FontWeight.bold : FontWeight.normal,
                fontSize: 14,
              ),
            ),
            Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
          ],
        )
      ],
    );
  }

  Widget _buildStepDivider(bool isActive) {
    return Container(
      margin: const EdgeInsets.only(left: 13, top: 4, bottom: 4),
      width: 2,
      height: 24,
      color: isActive ? AppColors.primary : AppColors.surfaceLight,
    );
  }
}
