import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/constants.dart';
import '../../providers/auth_provider.dart';

class LoyaltyScreen extends StatelessWidget {
  const LoyaltyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (auth.isGuest) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          title: const Text('Rewards & Loyalty', style: TextStyle(color: AppColors.textPrimary)),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.stars, size: 64, color: AppColors.warning),
                const SizedBox(height: 16),
                const Text('Loyalty Club Exclusive', style: TextStyle(fontSize: 18, color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text('Earn 10 points for every ₹100 spent and redeem free burgers and sodas!', textAlign: TextAlign.center, style: TextStyle(color: AppColors.textSecondary)),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/register'),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  child: const Text('Create Account to Unlock', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text('Campus Rewards', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Points Balance Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFB45309), Color(0xFFF59E0B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Available Reward Balance', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.stars, color: Colors.white, size: 36),
                      const SizedBox(width: 8),
                      Text(
                        '${auth.loyaltyPoints}',
                        style: const TextStyle(fontSize: 38, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      const Text('Points', style: TextStyle(color: Colors.white, fontSize: 18)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Earn 10 points per ₹100 spent • Instant redemption at counter', style: TextStyle(color: Colors.white70, fontSize: 11)),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Available Coupons List
            const Text('Available Coupons', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            _buildCouponCard(
              context,
              'CAMPUS20',
              '₹20 OFF on orders above ₹100',
              '50 Points required',
              50,
              auth,
            ),
            const SizedBox(height: 12),
            _buildCouponCard(
              context,
              'WELCOME50',
              '₹50 OFF on orders above ₹150',
              '100 Points required',
              100,
              auth,
            ),

            const SizedBox(height: 24),

            // Points Earning History Log
            const Text('Points History', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: const [
                  _HistoryRow(title: 'Order ORD-101 Completed', pts: '+18 pts', date: 'Today, 1:20 PM', isAdd: true),
                  Divider(color: AppColors.surfaceLight),
                  _HistoryRow(title: 'Coupon CAMPUS20 Redeemed', pts: '-50 pts', date: 'Yesterday', isAdd: false),
                  Divider(color: AppColors.surfaceLight),
                  _HistoryRow(title: 'Welcome Student Bonus', pts: '+50 pts', date: 'Signup bonus', isAdd: true),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildCouponCard(BuildContext context, String code, String desc, String cost, int ptsRequired, AuthProvider auth) {
    final canRedeem = auth.loyaltyPoints >= ptsRequired;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(code, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 2),
              Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              Text(cost, style: const TextStyle(color: AppColors.warning, fontSize: 11)),
            ],
          ),
          ElevatedButton(
            onPressed: canRedeem
                ? () {
                    auth.redeemPoints(ptsRequired);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Coupon $code unlocked & ready at checkout!')),
                    );
                  }
                : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Redeem', style: TextStyle(fontSize: 12, color: Colors.white)),
          )
        ],
      ),
    );
  }
}

class _HistoryRow extends StatelessWidget {
  final String title;
  final String pts;
  final String date;
  final bool isAdd;

  const _HistoryRow({required this.title, required this.pts, required this.date, required this.isAdd});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
              Text(date, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            ],
          ),
          Text(
            pts,
            style: TextStyle(color: isAdd ? AppColors.success : AppColors.danger, fontWeight: FontWeight.bold, fontSize: 13),
          )
        ],
      ),
    );
  }
}
