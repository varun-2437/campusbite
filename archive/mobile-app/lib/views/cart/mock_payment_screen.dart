import 'package:flutter/material.dart';
import '../../config/constants.dart';
import '../../models/models.dart';

class MockPaymentScreen extends StatefulWidget {
  final OrderModel order;
  const MockPaymentScreen({super.key, required this.order});

  @override
  State<MockPaymentScreen> createState() => _MockPaymentScreenState();
}

class _MockPaymentScreenState extends State<MockPaymentScreen> {
  bool _isProcessing = false;

  void _completePayment(bool isSuccess) {
    setState(() => _isProcessing = true);

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      setState(() => _isProcessing = false);

      if (isSuccess) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppColors.success,
            content: Text('Payment Successful! Token Generated.'),
          ),
        );
        Navigator.pushReplacementNamed(context, '/tracking', arguments: widget.order);
      } else {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            backgroundColor: AppColors.surface,
            title: const Row(
              children: [
                Icon(Icons.error_outline, color: AppColors.danger),
                SizedBox(width: 8),
                Text('Payment Failed', style: TextStyle(color: Colors.white, fontSize: 18)),
              ],
            ),
            content: const Text(
              'Your transaction could not be processed. Would you like to retry or switch payment method?',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.pop(context); // Go back to cart
                },
                child: const Text('Change Method', style: TextStyle(color: AppColors.textMuted)),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                child: const Text('Retry Payment', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('CampusBite Payment Gateway', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Gateway Logo & Order Details Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.surfaceLight),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.shield_outlined, color: AppColors.info, size: 24),
                        SizedBox(width: 8),
                        Text('Razorpay Secure Sandbox', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600, fontSize: 13)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '₹${widget.order.totalAmount.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: AppColors.primary),
                    ),
                    const SizedBox(height: 6),
                    Text('Order ID: ${widget.order.orderId}', style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                    Text('Customer: ${widget.order.customerName}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              const Text(
                'Simulate Payment Result',
                style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              const Text(
                'Select an outcome to test order token generation or payment retry flow.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
              ),

              const Spacer(),

              if (_isProcessing) ...[
                const CircularProgressIndicator(color: AppColors.primary),
                const SizedBox(height: 16),
                const Text('Verifying with bank servers...', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const Spacer(),
              ] else ...[
                // SUCCESS BUTTON
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton.icon(
                    onPressed: () => _completePayment(true),
                    icon: const Icon(Icons.check_circle_outline, color: Colors.white),
                    label: const Text('Mark as SUCCESS (Paid)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // FAILED BUTTON
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton.icon(
                    onPressed: () => _completePayment(false),
                    icon: const Icon(Icons.cancel_outlined, color: Colors.white),
                    label: const Text('Mark as FAILED (Declined)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.danger,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
