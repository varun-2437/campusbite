import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/constants.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('My Profile', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // User Avatar & Name
            Center(
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white24, width: 3),
                    ),
                    child: Center(
                      child: Text(
                        auth.name.isNotEmpty ? auth.name[0] : 'U',
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    auth.name,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    auth.email,
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                  if (!auth.isGuest)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text(
                        'Student Roll ID: ${auth.studentId}',
                        style: const TextStyle(fontSize: 12, color: AppColors.warning, fontWeight: FontWeight.w600),
                      ),
                    ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Profile Options Card
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.surfaceLight),
              ),
              child: Column(
                children: [
                  _buildProfileTile(
                    Icons.payment,
                    'Saved Payment Methods',
                    'Razorpay UPI / Cards',
                    () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Saved UPI: krithik@okhdfcbank'))),
                  ),
                  const Divider(color: AppColors.surfaceLight, height: 1),
                  _buildProfileTile(
                    Icons.card_giftcard,
                    'Loyalty & Coupons',
                    '${auth.loyaltyPoints} Available Points',
                    () => Navigator.pushNamed(context, '/loyalty'),
                  ),
                  const Divider(color: AppColors.surfaceLight, height: 1),
                  _buildProfileTile(
                    Icons.notifications_outlined,
                    'Push Notifications',
                    'Order status alerts active',
                    () => Navigator.pushNamed(context, '/notifications'),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Sign Out / Register CTA
            if (auth.isGuest)
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/register'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Create Permanent Account', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              )
            else
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: () {
                    auth.logout();
                    Navigator.pushReplacementNamed(context, '/');
                  },
                  icon: const Icon(Icons.logout, color: AppColors.danger, size: 20),
                  label: const Text('Log Out', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.danger),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileTile(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary, size: 22),
      title: Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
      onTap: onTap,
    );
  }
}
