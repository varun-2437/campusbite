import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/constants.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/auth_provider.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _couponController = TextEditingController();
  final _instructionsController = TextEditingController();
  String _selectedPaymentMethod = 'Online'; // 'Online' | 'Cash'

  void _handleCheckout() {
    final cart = Provider.of<CartProvider>(context, listen: false);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final orderProv = Provider.of<OrderProvider>(context, listen: false);

    if (cart.items.isEmpty) return;

    final createdOrder = orderProv.createOrder(
      cartItems: cart.items.values.toList(),
      totalAmount: cart.totalAmount,
      paymentMethod: _selectedPaymentMethod,
      customerName: auth.name,
      specialInstructions: _instructionsController.text.trim(),
    );

    // Credit loyalty points if registered student
    if (!auth.isGuest) {
      auth.addPoints((cart.totalAmount / 10).floor());
    }

    cart.clearCart();

    Navigator.pushNamed(context, '/tracking', arguments: createdOrder);
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    if (cart.items.isEmpty) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          title: const Text('My Cart', style: TextStyle(color: AppColors.textPrimary)),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('🛒', style: TextStyle(fontSize: 64)),
              const SizedBox(height: 16),
              const Text('Your cart is empty', style: TextStyle(fontSize: 18, color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Explore the cafeteria menu and add delicious food!', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('Order Checkout', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline, color: AppColors.danger),
            onPressed: () => cart.clearCart(),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Cart Items List
                ...cart.items.values.map((item) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.surfaceLight),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.item.name, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                              const SizedBox(height: 2),
                              Text('₹${item.item.price.toStringAsFixed(0)} each', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                              if (item.customization.isNotEmpty)
                                Text('"${item.customization}"', style: const TextStyle(color: AppColors.warning, fontSize: 11, fontStyle: FontStyle.italic)),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => cart.updateQuantity(item.item.itemId, -1),
                              icon: const Icon(Icons.remove_circle_outline, color: AppColors.primary, size: 20),
                            ),
                            Text('${item.quantity}', style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
                            IconButton(
                              onPressed: () => cart.updateQuantity(item.item.itemId, 1),
                              icon: const Icon(Icons.add_circle_outline, color: AppColors.primary, size: 20),
                            ),
                          ],
                        ),
                        Text(
                          '₹${item.totalPrice.toStringAsFixed(0)}',
                          style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                  );
                }).toList(),

                const SizedBox(height: 12),

                // Coupon Code Input
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _couponController,
                          textCapitalization: TextCapitalization.characters,
                          style: const TextStyle(color: AppColors.textPrimary),
                          decoration: InputDecoration(
                            hintText: 'Enter Coupon (e.g. CAMPUS20)',
                            hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          final applied = cart.applyCoupon(_couponController.text);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(applied ? 'Coupon applied successfully!' : 'Invalid or expired coupon')),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.surfaceLight,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Apply', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                      )
                    ],
                  ),
                ),

                const SizedBox(height: 12),

                // Special Instructions
                TextField(
                  controller: _instructionsController,
                  style: const TextStyle(color: AppColors.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Note for kitchen chef (e.g. Extra napkins, less spicy)',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),

                const SizedBox(height: 16),

                // Payment Method Selector
                const Text('Select Payment Method', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedPaymentMethod = 'Online'),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: _selectedPaymentMethod == 'Online' ? AppColors.primary.withOpacity(0.15) : AppColors.surface,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: _selectedPaymentMethod == 'Online' ? AppColors.primary : AppColors.surfaceLight),
                          ),
                          child: Column(
                            children: const [
                              Icon(Icons.payment, color: AppColors.info),
                              SizedBox(height: 4),
                              Text('Online (Razorpay)', style: TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                              Text('Instant checkout', style: TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedPaymentMethod = 'Cash'),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: _selectedPaymentMethod == 'Cash' ? AppColors.primary.withOpacity(0.15) : AppColors.surface,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: _selectedPaymentMethod == 'Cash' ? AppColors.primary : AppColors.surfaceLight),
                          ),
                          child: Column(
                            children: const [
                              Icon(Icons.money, color: AppColors.success),
                              SizedBox(height: 4),
                              Text('Pay Cash at Counter', style: TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                              Text('Collect ticket at POS', style: TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Total Breakdown & Checkout Button
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Subtotal', style: TextStyle(color: AppColors.textSecondary)),
                      Text('₹${cart.subtotal.toStringAsFixed(0)}', style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  if (cart.discountAmount > 0) ...[
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Discount (${cart.couponCode})', style: const TextStyle(color: AppColors.success)),
                        Text('-₹${cart.discountAmount.toStringAsFixed(0)}', style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Amount', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('₹${cart.totalAmount.toStringAsFixed(0)}', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 20)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _handleCheckout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(
                        'Place Order • ₹${cart.totalAmount.toStringAsFixed(0)}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
