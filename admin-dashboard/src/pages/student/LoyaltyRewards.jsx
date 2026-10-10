import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Award,
  Sparkles,
  Gift,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function LoyaltyRewards() {
  const { studentUser, redeemReward } = useStore();
  const navigate = useNavigate();

  const [redeemToast, setRedeemToast] = useState(null);

  const points = studentUser.loyaltyPoints || 0;

  // Tier calculation
  const getTier = () => {
    if (points >= 300) return { name: 'Gold Diner', progress: 100, nextTier: 'Max Tier Reached', color: '#f59e0b' };
    if (points >= 150) return { name: 'Silver Diner', progress: Math.min(100, Math.round(((points - 150) / 150) * 100)), nextTier: '150 pts to Gold', color: '#94a3b8' };
    return { name: 'Bronze Diner', progress: Math.min(100, Math.round((points / 150) * 100)), nextTier: `${150 - points} pts to Silver`, color: '#d97706' };
  };

  const tier = getTier();

  const rewards = [
    {
      id: 'rew_coffee',
      title: 'Free South Indian Filter Coffee',
      desc: 'Authentic frothy morning filter coffee cup.',
      cost: 50,
      discount: 25,
      icon: '☕'
    },
    {
      id: 'rew_snack',
      title: 'Flat ₹30 OFF on Evening Snacks',
      desc: 'Valid on samosas, sandwiches and rolls.',
      cost: 60,
      discount: 30,
      icon: '🥪'
    },
    {
      id: 'rew_combo',
      title: 'Flat ₹50 OFF on Meal Combos',
      desc: 'Valid on Dum Biryani or Fried Rice meals.',
      cost: 100,
      discount: 50,
      icon: '🍛'
    },
    {
      id: 'rew_dessert',
      title: 'Free Sizzling Brownie Slice',
      desc: 'Warm fudge brownie with vanilla dip.',
      cost: 140,
      discount: 95,
      icon: '🍨'
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
    <div style={styles.container}>
      {redeemToast && (
        <div style={styles.toast}>
          <Gift size={16} color="var(--accent-primary)" />
          <span>Redeemed <strong>{redeemToast}</strong>! Coupon added to cart.</span>
        </div>
      )}

      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Campus Loyalty & Student Perks</h1>
          <p style={styles.pageSubtitle}>
            Earn 10 points for every ₹100 spent at canteen counters. Redeem for free meals & vouchers!
          </p>
        </div>
      </div>

      <div style={styles.topCardsGrid}>
        {/* Main Points Card */}
        <div style={styles.pointsCard}>
          <div style={styles.pointsCardTop}>
            <div>
              <div style={styles.pointsLabel}>AVAILABLE BALANCE</div>
              <div style={styles.pointsNumber}>{points} <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>PTS</span></div>
            </div>
            <div style={styles.awardCircle}>
              <Award size={36} color="#fff" />
            </div>
          </div>

          <div style={styles.tierSection}>
            <div style={styles.tierRow}>
              <span style={{ ...styles.tierName, color: tier.color }}>★ {tier.name}</span>
              <span style={styles.nextTierText}>{tier.nextTier}</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${tier.progress}%`, backgroundColor: tier.color }} />
            </div>
          </div>
        </div>

        {/* Earning Rules Card */}
        <div style={styles.rulesCard}>
          <div style={styles.rulesHeader}>
            <Zap size={18} color="var(--accent-primary)" />
            <span style={styles.rulesTitle}>How You Earn Rewards</span>
          </div>

          <div style={styles.ruleItem}>
            <span style={styles.ruleIcon}>🍛</span>
            <div>
              <div style={styles.ruleHeading}>10 Points / ₹100 Order</div>
              <div style={styles.ruleSub}>Automatically credited when order is collected.</div>
            </div>
          </div>

          <div style={styles.ruleItem}>
            <span style={styles.ruleIcon}>⭐</span>
            <div>
              <div style={styles.ruleHeading}>+15 Bonus Points on Review</div>
              <div style={styles.ruleSub}>Leave feedback for the kitchen after pickup.</div>
            </div>
          </div>

          <div style={styles.ruleItem}>
            <span style={styles.ruleIcon}>🎉</span>
            <div>
              <div style={styles.ruleHeading}>Tier Multipliers</div>
              <div style={styles.ruleSub}>Gold Diners get 1.5x points on every breakfast.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div style={styles.rewardsSection}>
        <div style={styles.sectionHeader}>
          <Gift size={20} color="var(--accent-primary)" />
          <h2 style={styles.sectionTitle}>Redeemable Vouchers & Food Perks</h2>
        </div>

        <div style={styles.rewardsGrid}>
          {rewards.map((reward) => {
            const canAfford = points >= reward.cost;

            return (
              <div key={reward.id} style={styles.rewardCard}>
                <div style={styles.rewardTop}>
                  <span style={styles.rewardIcon}>{reward.icon}</span>
                  <div style={styles.rewardCostBadge}>
                    <Sparkles size={12} color="var(--accent-primary)" />
                    <span>{reward.cost} PTS</span>
                  </div>
                </div>

                <h3 style={styles.rewardTitle}>{reward.title}</h3>
                <p style={styles.rewardDesc}>{reward.desc}</p>

                <div style={styles.rewardFooter}>
                  <div style={styles.discountValue}>Worth ₹{reward.discount}</div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    style={{
                      ...styles.redeemBtn,
                      backgroundColor: canAfford ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: canAfford ? '#fff' : 'var(--text-muted)',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      border: canAfford ? 'none' : '1px solid var(--border-color)'
                    }}
                  >
                    {canAfford ? 'Redeem Voucher' : `Need ${reward.cost - points} more pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem',
    minHeight: '100vh'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#18233c',
    border: '1px solid var(--accent-primary)',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    zIndex: 2000,
    animation: 'slideUp 0.25s ease-out'
  },
  header: {
    marginBottom: '1.5rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  topCardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  pointsCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: '20px',
    padding: '1.75rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  pointsCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  pointsLabel: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  pointsNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#fff',
    marginTop: '4px'
  },
  awardCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)'
  },
  tierSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  tierRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  tierName: {
    fontWeight: '700'
  },
  nextTierText: {
    color: 'var(--text-muted)',
    fontSize: '0.78rem'
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s ease'
  },
  rulesCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px',
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  rulesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--border-color)'
  },
  rulesTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  ruleIcon: {
    fontSize: '1.25rem'
  },
  ruleHeading: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  ruleSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  rewardsSection: {
    marginTop: '1rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.25rem'
  },
  rewardCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-sm)'
  },
  rewardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.85rem'
  },
  rewardIcon: {
    fontSize: '1.8rem'
  },
  rewardCostBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    color: 'var(--accent-primary)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '800'
  },
  rewardTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    lineHeight: 1.3
  },
  rewardDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    marginBottom: '1.25rem'
  },
  rewardFooter: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  discountValue: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#10b981'
  },
  redeemBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: '700',
    transition: 'all 0.2s'
  }
};
