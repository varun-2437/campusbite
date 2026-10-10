import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../models/order_model.dart';
import '../../providers/order_provider.dart';
import '../../widgets/order_status_stepper.dart';
import '../../widgets/qr_code_widget.dart';
import '../../widgets/custom_button.dart';
import '../feedback/feedback_screen.dart';

class OrderTrackingScreen extends StatelessWidget {
  final OrderModel? order;

  const OrderTrackingScreen({super.key, this.order});

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final activeOrder = order ?? orderProvider.activeOrder;

    if (activeOrder == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Track Order')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.delivery_dining_outlined,
                      size: 38, color: AppColors.primary),
                ),
                const SizedBox(height: 16),
                const Text(
                  'No Active Orders in Progress',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                const Text(
                  'When you place an order at any canteen counter, you can follow its live preparation and pickup token here.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final isCollected = activeOrder.status == OrderStatus.collected;
    final isReady = activeOrder.status == OrderStatus.ready;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${activeOrder.orderId}'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Live Status Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isReady
                      ? AppColors.success.withOpacity(0.12)
                      : isCollected
                          ? Colors.grey.shade100
                          : AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isReady
                        ? AppColors.success.withOpacity(0.4)
                        : isCollected
                            ? AppColors.border
                            : AppColors.primary.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isReady
                          ? Icons.notifications_active_rounded
                          : isCollected
                              ? Icons.check_circle_outline
                              : Icons.access_time_filled_rounded,
                      color: isReady
                          ? AppColors.success
                          : isCollected
                              ? AppColors.textSecondary
                              : AppColors.primary,
                      size: 28,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isReady
                                ? '🎉 Food Ready for Pickup!'
                                : isCollected
                                    ? 'Order Completed'
                                    : 'Estimated Pickup: ~${activeOrder.estimatedReadyMinutes} mins',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: isReady
                                  ? AppColors.success
                                  : isCollected
                                      ? AppColors.textPrimary
                                      : AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isReady
                                ? 'Show your token QR at the food counter to collect.'
                                : isCollected
                                    ? 'Thank you for dining with CampusBite!'
                                    : 'Our canteen chefs are preparing your hot meal.',
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // QR & Token Card
              QrCodeWidget(
                qrData: activeOrder.qrCode,
                tokenId: activeOrder.tokenId,
                size: 190,
              ),
              const SizedBox(height: 12),
              const Text(
                'Show this Digital Token / QR at Counter to Pickup',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 28),

              // Stepper
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Live Order Status',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 18),
                    OrderStatusStepper(currentStatus: activeOrder.status),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Order Summary Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Order Details',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    const Divider(height: 18),
                    ...activeOrder.items.map((item) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('${item.quantity}x ${item.menuItem.name}'),
                              Text(
                                '₹${item.totalPrice.toInt()}',
                                style: const TextStyle(fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        )),
                    const Divider(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Payment Mode',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                        Text(
                          '${activeOrder.paymentMethod} (${activeOrder.paymentStatus})',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total Paid',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '₹${activeOrder.totalAmount.toInt()}',
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Action Buttons
              if (isCollected && !activeOrder.isReviewed)
                CustomButton(
                  text: '⭐ Rate Your Food Experience',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => FeedbackScreen(orderId: activeOrder.orderId),
                      ),
                    );
                  },
                ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
