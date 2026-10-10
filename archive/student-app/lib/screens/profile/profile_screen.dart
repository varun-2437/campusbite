import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';
import '../loyalty/loyalty_screen.dart';
import '../history/order_history_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _pushNotifications = true;
  bool _soundEnabled = true;

  void _showEditProfileDialog() {
    final auth = context.read<AuthProvider>();
    final nameController = TextEditingController(text: auth.user?.name);
    final emailController = TextEditingController(text: auth.user?.email);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Edit Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Full Name'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email Address'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              auth.updateProfile(
                name: nameController.text.trim(),
                email: emailController.text.trim(),
              );
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Profile updated successfully!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out of CampusBite?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              context.read<AuthProvider>().logout();
              Navigator.pop(ctx);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final isGuest = auth.isGuest || user == null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Profile'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Avatar & Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 32,
                      backgroundColor: AppColors.primary.withOpacity(0.12),
                      child: Text(
                        isGuest ? 'G' : (user.name.isNotEmpty ? user.name[0].toUpperCase() : 'S'),
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                isGuest ? 'Guest Diner' : user.name,
                                style: const TextStyle(
                                  fontSize: 16.5,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              if (!isGuest) ...[
                                const SizedBox(width: 6),
                                const Icon(Icons.verified_rounded,
                                    size: 16, color: AppColors.secondary),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isGuest ? 'Temporary Session' : user.email,
                            style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary),
                          ),
                          if (!isGuest && user.studentId != null) ...[
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.divider,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'ID: ${user.studentId}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    if (!isGuest)
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, size: 20),
                        onPressed: _showEditProfileDialog,
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              if (isGuest) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.warning.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.star_rounded, color: AppColors.warning),
                          SizedBox(width: 8),
                          Text(
                            'Create an Account',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Unlock order history, loyalty rewards, and student exclusive pricing.',
                        style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 12),
                      CustomButton(
                        text: 'Register Now',
                        height: 40,
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const RegisterScreen()),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Quick Nav Links
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.stars_rounded, color: AppColors.accent),
                      title: const Text('Loyalty Rewards & Points'),
                      trailing: Text(
                        isGuest ? '0 pts' : '${user.loyaltyPoints} pts',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const LoyaltyScreen()),
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.receipt_long_rounded, color: AppColors.secondary),
                      title: const Text('Past Orders & Invoices'),
                      trailing: const Icon(Icons.chevron_right, size: 20),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const OrderHistoryScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Saved Payment Methods
              const Text(
                'Saved Payment Methods',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.credit_card_rounded, color: AppColors.primary, size: 22),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'UPI / Razorpay Quick Checkout',
                                style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                'Google Pay / PhonePe / Paytm / Cards',
                                style: TextStyle(fontSize: 11.5, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        Icon(Icons.check_circle, color: AppColors.success, size: 18),
                      ],
                    ),
                    Divider(height: 20),
                    Row(
                      children: [
                        Icon(Icons.storefront_rounded, color: AppColors.secondary, size: 22),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Campus Counter Cash Verification',
                                style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                'Token barcode printed upon counter payment',
                                style: TextStyle(fontSize: 11.5, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        Icon(Icons.check_circle, color: AppColors.success, size: 18),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Notification & App Settings
              const Text(
                'Preferences',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    SwitchListTile(
                      value: _pushNotifications,
                      activeColor: AppColors.primary,
                      title: const Text('Push Notifications (Firebase FCM)'),
                      subtitle: const Text('Alerts when meal is preparing & ready for pickup'),
                      onChanged: (val) => setState(() => _pushNotifications = val),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      value: _soundEnabled,
                      activeColor: AppColors.primary,
                      title: const Text('Sound & Haptics'),
                      subtitle: const Text('Audio chime on order status updates'),
                      onChanged: (val) => setState(() => _soundEnabled = val),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Logout / Sign in button
              if (isGuest)
                CustomButton(
                  text: 'Exit Guest Mode / Student Login',
                  isOutlined: true,
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  },
                )
              else
                CustomButton(
                  text: 'Log Out of Account',
                  backgroundColor: AppColors.error,
                  textColor: Colors.white,
                  onPressed: _showLogoutDialog,
                ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
