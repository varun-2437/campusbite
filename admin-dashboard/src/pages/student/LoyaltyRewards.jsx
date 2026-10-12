import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatCard } from '../../theme/ui';
import {
  Award,
  Gift,
  CheckCircle2,
  Zap,
  TrendingUp,
  Tag,
  Lock,
  ArrowRight,
  ShieldAlert,
  LogIn
} from 'lucide-react';

export default function LoyaltyRewards() {
  const { studentUser, redeemReward } = useStore();
  const { user, isGuest, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [redeemToast, setRedeemToast] = useState(null);

  // GUEST GATE: Unauthenticated visitors must sign in as student
  if (isGuest) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto animate-in fade-in duration-200">
        <div className="card text-center p-8 space-y-4 border border-line">
          <div className="w-14 h-14 rounded-full bg-accent-soft border border-line flex items-center justify-center mx-auto text-accent">
            <Gift size={26} strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[18px] font-semibold text-fg">Student Login Required</h2>
            <p className="text-[13px] text-fg-muted leading-relaxed">
              The CampusBite Rewards program is reserved for logged-in students. Sign in with your student account to earn points on every canteen order and redeem discount vouchers.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              type="button"
              onClick={openAuthModal}
              className="btn-primary h-9 px-4 text-[13px] font-semibold gap-1.5"
            >
              <LogIn size={14} strokeWidth={1.75} />
              <span>Sign In as Student</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary h-9 px-4 text-[13px] font-semibold"
            >
              Browse Canteen Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STAFF GATE: Staff accounts (cashier, kitchen, beverage, counter, manager) are redirected to their work dashboards
  if (user?.role !== 'student') {
    const roleTitle = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff';
    const getDashboardPath = (role) => {
      switch (role) {
        case 'cashier':
          return '/cashier';
        case 'kitchen':
          return '/kitchen';
        case 'beverage':
          return '/beverage';
        case 'counter':
          return '/counter';
        case 'manager':
          return '/manager/reports';
        default:
          return '/';
      }
    };

    return (
      <div className="py-12 px-4 max-w-lg mx-auto animate-in fade-in duration-200">
        <div className="card text-center p-8 space-y-4 border border-line">
          <div className="w-14 h-14 rounded-full bg-accent-soft border border-line flex items-center justify-center mx-auto text-accent">
            <ShieldAlert size={26} strokeWidth={1.75} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[18px] font-semibold text-fg">Student Loyalty Program</h2>
            <p className="text-[13px] text-fg-muted leading-relaxed">
              Canteen rewards and discount vouchers are only available for student diners. You are currently logged in with a <strong className="text-fg">{roleTitle}</strong> account.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              type="button"
              onClick={() => navigate(getDashboardPath(user?.role))}
              className="btn-primary h-9 px-4 text-[13px] font-semibold gap-1.5"
            >
              <span>Go to {roleTitle} Dashboard</span>
              <ArrowRight size={14} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary h-9 px-4 text-[13px] font-semibold"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN STUDENT VIEW
  const points = user?.loyaltyPoints ?? studentUser.loyaltyPoints ?? 0;

  const getTier = () => {
    if (points >= 300) return { name: 'Gold Tier', progress: 100, nextTier: 'Max Tier reached' };
    if (points >= 150) return { name: 'Silver Tier', progress: Math.min(100, Math.round(((points - 150) / 150) * 100)), nextTier: '150 pts to Gold' };
    return { name: 'Bronze Tier', progress: Math.min(100, Math.round((points / 150) * 100)), nextTier: `${150 - points} pts to Silver` };
  };

  const tier = getTier();

  const rewards = [
    {
      id: 'rew_coffee',
      title: 'Filter Coffee Voucher',
      desc: 'Valid on morning or afternoon filter coffee.',
      cost: 50,
      discount: 25
    },
    {
      id: 'rew_snack',
      title: 'Evening Snack Discount',
      desc: 'Flat ₹30 off on rolls, samosas and snacks.',
      cost: 60,
      discount: 30
    },
    {
      id: 'rew_combo',
      title: 'Main Meal Combo Voucher',
      desc: 'Flat ₹50 off on Dum Biryani or Fried Rice meals.',
      cost: 100,
      discount: 50
    },
    {
      id: 'rew_dessert',
      title: 'Dessert Voucher',
      desc: 'Valid on chocolate brownie or ice cream sundaes.',
      cost: 140,
      discount: 95
    }
  ];

  const handleRedeem = (reward) => {
    const res = redeemReward(reward);
    if (res.success) {
      setRedeemToast(reward.title);
      setTimeout(() => setRedeemToast(null), 3000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {redeemToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-surface border border-line-strong rounded-lg shadow-pop px-4 py-3 flex items-center gap-2.5 text-[13px] text-fg animate-in fade-in duration-150"
        >
          <CheckCircle2 size={16} strokeWidth={1.75} className="text-success shrink-0" />
          <span>Voucher <strong className="font-semibold">{redeemToast}</strong> added to cart.</span>
        </div>
      )}

      <PageHeader
        title="Loyalty & Student Rewards"
        subtitle="Earn 10 points for every ₹100 spent at canteen counters. Redeem points for discount vouchers."
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Available Points"
          value={points}
          icon={Award}
          hint={`${tier.name} status`}
        />
        <StatCard
          label="Membership Tier"
          value={tier.name}
          icon={TrendingUp}
          hint={tier.nextTier}
        />
        <StatCard
          label="Earning Rate"
          value="10 pts / ₹100"
          icon={Zap}
          hint="Credited upon order collection"
        />
      </div>

      {/* Tier Progress Bar Card */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-fg">{tier.name}</span>
          <span className="text-fg-muted">{tier.nextTier}</span>
        </div>
        <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden border border-line">
          <div
            className="h-full bg-accent transition-all duration-300 rounded-full"
            style={{ width: `${tier.progress}%` }}
          />
        </div>
      </div>

      {/* Rewards Catalog */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <h2 className="text-[17px] font-semibold text-fg">
            Available Discount Vouchers
          </h2>
          <span className="text-[12.5px] text-fg-muted">
            Click to redeem and auto-apply to cart
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {rewards.map((reward) => {
            const canAfford = points >= reward.cost;

            return (
              <div key={reward.id} className="card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded tabular-nums">
                      {reward.cost} pts
                    </span>
                    <span className="text-[12.5px] font-semibold text-success tabular-nums">
                      Value: ₹{reward.discount}
                    </span>
                  </div>

                  <h3 className="text-[14px] font-semibold text-fg mt-3">
                    {reward.title}
                  </h3>
                  <p className="text-[12px] text-fg-muted mt-1 leading-relaxed">
                    {reward.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className="btn-primary w-full btn-sm"
                  >
                    {canAfford ? 'Redeem Voucher' : `Need ${reward.cost - points} more pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
