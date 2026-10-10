import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../models/menu_item.dart';
import '../providers/cart_provider.dart';
import 'veg_badge.dart';
import 'custom_button.dart';

class ItemDetailSheet extends StatefulWidget {
  final MenuItem item;

  const ItemDetailSheet({super.key, required this.item});

  static Future<void> show(BuildContext context, MenuItem item) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ItemDetailSheet(item: item),
    );
  }

  @override
  State<ItemDetailSheet> createState() => _ItemDetailSheetState();
}

class _ItemDetailSheetState extends State<ItemDetailSheet> {
  int _quantity = 1;
  final List<MenuItemCustomization> _selectedCustomizations = [];
  final TextEditingController _instructionsController = TextEditingController();

  @override
  void dispose() {
    _instructionsController.dispose();
    super.dispose();
  }

  double get _totalPrice {
    double base = widget.item.price;
    for (final c in _selectedCustomizations) {
      base += c.extraPrice;
    }
    return base * _quantity;
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      maxHeight: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 10, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          Flexible(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(20, 0, 20, bottomInset + 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: SizedBox(
                      height: 180,
                      width: double.infinity,
                      child: Image.network(
                        widget.item.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: AppColors.divider,
                          child: const Icon(Icons.fastfood, size: 50, color: AppColors.textLight),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Header Info
                  Row(
                    children: [
                      VegBadge(isVeg: widget.item.isVeg, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.item.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                      Text(
                        '₹${widget.item.price.toInt()}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Badges
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.divider,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          widget.item.category,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.timer_outlined, size: 14, color: AppColors.textSecondary),
                      const SizedBox(width: 3),
                      Text(
                        '${widget.item.prepTime} mins avg prep',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Description
                  Text(
                    widget.item.description,
                    style: const TextStyle(
                      fontSize: 13.5,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),

                  // Customizations Section
                  if (widget.item.customizations.isNotEmpty) ...[
                    const SizedBox(height: 18),
                    const Text(
                      'Customize your order',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...widget.item.customizations.map((c) {
                      final isSelected = _selectedCustomizations.contains(c);
                      return CheckboxListTile(
                        value: isSelected,
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                        activeColor: AppColors.primary,
                        title: Text(
                          c.name,
                          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w500),
                        ),
                        secondary: c.extraPrice > 0
                            ? Text(
                                '+₹${c.extraPrice.toInt()}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              )
                            : const Text(
                                'Free',
                                style: TextStyle(fontSize: 12, color: AppColors.success),
                              ),
                        onChanged: (val) {
                          setState(() {
                            if (val == true) {
                              _selectedCustomizations.add(c);
                            } else {
                              _selectedCustomizations.remove(c);
                            }
                          });
                        },
                      );
                    }).toList(),
                  ],

                  // Special Instructions
                  const SizedBox(height: 14),
                  const Text(
                    'Special instructions',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _instructionsController,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Less spicy, keep chutney separate...',
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Quantity Selector & Add Button
                  Row(
                    children: [
                      // Counter
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.border),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 18),
                              onPressed: _quantity > 1
                                  ? () => setState(() => _quantity--)
                                  : null,
                            ),
                            Text(
                              '$_quantity',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add, size: 18),
                              onPressed: () => setState(() => _quantity++),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),

                      // Add Button
                      Expanded(
                        child: CustomButton(
                          text: 'Add to Cart • ₹${_totalPrice.toInt()}',
                          onPressed: () {
                            context.read<CartProvider>().addToCart(
                                  widget.item,
                                  quantity: _quantity,
                                  customizations: _selectedCustomizations,
                                  specialInstructions: _instructionsController.text.trim(),
                                );
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Added ${widget.item.name} to cart!'),
                                duration: const Duration(seconds: 2),
                                behavior: SnackBarBehavior.floating,
                                action: SnackBarAction(
                                  label: 'View Cart',
                                  textColor: AppColors.accent,
                                  onPressed: () {},
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
