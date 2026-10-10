import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/notification_provider.dart';
import '../../services/razorpay_service.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/veg_badge.dart';
import 'order_success_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();
  String _selectedPaymentMethod = 'Online'; // 'Online' or 'Cash'
  bool _isProcessingCheckout = false;

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  void _handleCheckout() async {
    final cart = context.read<CartProvider>();
    final auth = context.read<AuthProvider>();
    final orderProvider = context.read<OrderProvider>();
    final notifProvider = context.read<NotificationProvider>();

    if (cart.items.isEmpty) return;

    setState(() => _isProcessingCheckout = true);

    if (_selectedPaymentMethod == 'Online') {
      // Run Razorpay simulated checkout
      final razorpay = RazorpayService();
      final result = await razorpay.openCheckout(
        amount: cart.finalAmount,
        orderId: 'CB-${DateTime.now().millisecondsSinceEpoch}',
        userEmail: auth.user?.email ?? 'guest@campusbite.local',
        userName: auth.user?.name ?? 'Guest Diner',
      );

      if (!result.isSuccess) {
        if (mounted) {
          setState(() => _isProcessingCheckout = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result.errorMessage ?? 'Payment failed. Please retry.'),
              backgroundColor: AppColors.error,
            ),
          );
        }
        return;
      }
    }

    // Create Order
    final createdOrder = await orderProvider.createOrder(
      items: cart.items,
      user: auth.user,
      paymentMethod: _selectedPaymentMethod,
      subtotal: cart.subtotal,
      discount: cart.discountAmount,
      totalAmount: cart.finalAmount,
    );

    // Award loyalty points to registered students (10 pts per ₹100)
    if (!auth.isGuest) {
      final pointsEarned = (cart.finalAmount / 10).floor();
      if (pointsEarned > 0) {
        auth.addLoyaltyPoints(pointsEarned);
      }
    }

    // Add push notification
    notifProvider.addNotification(
      title: 'Order #${createdOrder.orderId} Confirmed!',
      body: _selectedPaymentMethod == 'Online'
          ? 'Payment confirmed via Razorpay. Your token is ${createdOrder.tokenId}.'
          : 'Please pay ₹${createdOrder.totalAmount.toInt()} at Cashier to start prep.',
      orderId: createdOrder.orderId,
    );

    // Clear Cart
    cart.clearCart();

    if (mounted) {
      setState(() => _isProcessingCheckout = false);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OrderSuccessScreen(order: createdOrder)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Cart'),
        actions: [
          if (cart.items.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.error),
              tooltip: 'Clear Cart',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Clear Cart?'),
                    content: const Text('Remove all items from your order?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                        onPressed: () {
                          cart.clearCart();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Clear'),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: cart.items.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.shopping_bag_outlined,
                          size: 44, color: AppColors.primary),
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'Your cart is empty',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Browse our fresh canteen meals, hot snacks, and beverages to start an order.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 24),
                    CustomButton(
                      text: 'Explore Menu',
                      width: 180,
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
            )
          : SafeArea(
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Cart Items List
                          ...cart.items.map((item) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Image.network(
                                      item.menuItem.imageUrl,
                                      width: 65,
                                      height: 65,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => Container(
                                        width: 65,
                                        height: 65,
                                        color: AppColors.divider,
                                        child: const Icon(Icons.fastfood,
                                            size: 24, color: AppColors.textLight),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            VegBadge(isVeg: item.menuItem.isVeg, size: 14),
                                            const SizedBox(width: 6),
                                            Expanded(
                                              child: Text(
                                                item.menuItem.name,
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        if (item.selectedCustomizations.isNotEmpty)
                                          Padding(
                                            padding: const EdgeInsets.only(top: 3),
                                            child: Text(
                                              item.selectedCustomizations
                                                  .map((c) => '+${c.name}')
                                                  .join(', '),
                                              style: const TextStyle(
                                                fontSize: 11,
                                                color: AppColors.textSecondary,
                                              ),
                                            ),
                                          ),
                                        if (item.specialInstructions.isNotEmpty)
                                          Padding(
                                            padding: const EdgeInsets.only(top: 2),
                                            child: Text(
                                              'Note: "${item.specialInstructions}"',
                                              style: const TextStyle(
                                                fontSize: 11,
                                                fontStyle: FontStyle.italic,
                                                color: AppColors.textLight,
                                              ),
                                            ),
                                          ),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              '₹${item.totalPrice.toInt()}',
                                              style: const TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w800,
                                                color: AppColors.primary,
                                              ),
                                            ),
                                            // Counter
                                            Container(
                                              decoration: BoxDecoration(
                                                color: AppColors.divider,
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: Row(
                                                children: [
                                                  InkWell(
                                                    onTap: () => cart.updateQuantity(
                                                        item.id, item.quantity - 1),
                                                    child: const Padding(
                                                      padding: EdgeInsets.all(4),
                                                      child: Icon(Icons.remove, size: 16),
                                                    ),
                                                  ),
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.symmetric(horizontal: 8),
                                                    child: Text(
                                                      '${item.quantity}',
                                                      style: const TextStyle(
                                                          fontSize: 13,
                                                          fontWeight: FontWeight.bold),
                                                    ),
                                                  ),
                                                  InkWell(
                                                    onTap: () => cart.updateQuantity(
                                                        item.id, item.quantity + 1),
                                                    child: const Padding(
                                                      padding: EdgeInsets.all(4),
                                                      child: Icon(Icons.add, size: 16),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),

                          const SizedBox(height: 12),

                          // Coupon Section
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.local_offer_outlined,
                                        size: 18, color: AppColors.primary),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'Have a Promo / Coupon Code?',
                                      style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                if (cart.appliedCoupon != null)
                                  Container(
                                    padding:
                                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: AppColors.success.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                          color: AppColors.success.withOpacity(0.3)),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            const Icon(Icons.check_circle,
                                                color: AppColors.success, size: 18),
                                            const SizedBox(width: 8),
                                            Text(
                                              '${cart.appliedCoupon!.code} applied (-₹${cart.discountAmount.toInt()})',
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.success,
                                              ),
                                            ),
                                          ],
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.close, size: 18),
                                          onPressed: () => cart.removeCoupon(),
                                        ),
                                      ],
                                    ),
                                  )
                                else
                                  Row(
                                    children: [
                                      Expanded(
                                        child: TextField(
                                          controller: _couponController,
                                          textCapitalization: TextCapitalization.characters,
                                          decoration: InputDecoration(
                                            hintText: 'e.g. CAMPUS50',
                                            contentPadding: const EdgeInsets.symmetric(
                                                horizontal: 12, vertical: 10),
                                            errorText: cart.couponError,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      ElevatedButton(
                                        onPressed: cart.isValidatingCoupon
                                            ? null
                                            : () {
                                                if (_couponController.text.trim().isNotEmpty) {
                                                  cart.applyCoupon(_couponController.text.trim());
                                                }
                                              },
                                        style: ElevatedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 16, vertical: 12),
                                        ),
                                        child: cart.isValidatingCoupon
                                            ? const SizedBox(
                                                width: 16,
                                                height: 16,
                                                child: CircularProgressIndicator(
                                                    strokeWidth: 2, color: Colors.white),
                                              )
                                            : const Text('Apply'),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Payment Method Selector
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Choose Payment Method',
                                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 10),
                                RadioListTile<String>(
                                  value: 'Online',
                                  groupValue: _selectedPaymentMethod,
                                  activeColor: AppColors.primary,
                                  title: const Text('Online Payment (Razorpay / UPI / Cards)'),
                                  subtitle: const Text('Instant queue confirmation & food prep'),
                                  secondary: const Icon(Icons.bolt_rounded, color: AppColors.primary),
                                  onChanged: (val) =>
                                      setState(() => _selectedPaymentMethod = val!),
                                ),
                                RadioListTile<String>(
                                  value: 'Cash',
                                  groupValue: _selectedPaymentMethod,
                                  activeColor: AppColors.primary,
                                  title: const Text('Pay Cash on Counter'),
                                  subtitle: const Text('Pay at cashier to verify & print token'),
                                  secondary: const Icon(Icons.money_rounded, color: AppColors.secondary),
                                  onChanged: (val) =>
                                      setState(() => _selectedPaymentMethod = val!),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Bill Breakdown
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Bill Summary',
                                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Subtotal',
                                        style: TextStyle(color: AppColors.textSecondary)),
                                    Text('₹${cart.subtotal.toInt()}',
                                        style: const TextStyle(fontWeight: FontWeight.w600)),
                                  ],
                                ),
                                if (cart.discountAmount > 0) ...[
                                  const SizedBox(height: 6),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      const Text('Coupon Discount',
                                          style: TextStyle(color: AppColors.success)),
                                      Text('-₹${cart.discountAmount.toInt()}',
                                          style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.success)),
                                    ],
                                  ),
                                ],
                                const SizedBox(height: 6),
                                const Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Canteen Handling / Tax',
                                        style: TextStyle(color: AppColors.textSecondary)),
                                    Text('₹0 (Waived)',
                                        style: TextStyle(
                                            color: AppColors.success, fontWeight: FontWeight.w600)),
                                  ],
                                ),
                                const Divider(height: 20),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text(
                                      'To Pay',
                                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    Text(
                                      '₹${cart.finalAmount.toInt()}',
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        color: AppColors.primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ),

                  // Bottom Checkout Bar
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border(top: BorderSide(color: AppColors.border, width: 1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          offset: const Offset(0, -3),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              'TOTAL AMOUNT',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textSecondary,
                                letterSpacing: 0.8,
                              ),
                            ),
                            Text(
                              '₹${cart.finalAmount.toInt()}',
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: CustomButton(
                            text: _selectedPaymentMethod == 'Online'
                                ? 'Pay with Razorpay'
                                : 'Generate Cash Token',
                            isLoading: _isProcessingCheckout,
                            onPressed: _handleCheckout,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
