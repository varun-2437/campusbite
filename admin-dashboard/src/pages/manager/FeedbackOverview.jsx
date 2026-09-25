import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Star, Filter } from 'lucide-react';

export default function FeedbackOverview() {
  const { feedbackList } = useStore();
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const filtered = feedbackList.filter((fb) => {
    if (ratingFilter === 'ALL') return true;
    return fb.rating === Number(ratingFilter);
  });

  const avgRating = (
    feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / feedbackList.length
  ).toFixed(1);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Student & Customer Feedback</h1>
          <p style={styles.pageSubtitle}>
            Ratings and reviews submitted after order collection
          </p>
        </div>

        <div style={styles.ratingBadge}>
          <Star size={20} fill="#f59e0b" color="#f59e0b" />
          <span style={styles.ratingScore}>{avgRating} / 5.0</span>
          <span style={styles.ratingCount}>({feedbackList.length} reviews)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterRow}>
        <div style={styles.filterGroup}>
          <Filter size={16} color="var(--text-secondary)" />
          <button
            onClick={() => setRatingFilter('ALL')}
            style={{ ...styles.filterBtn, ...(ratingFilter === 'ALL' ? styles.filterBtnActive : {}) }}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setRatingFilter(stars.toString())}
              style={{
                ...styles.filterBtn,
                ...(ratingFilter === stars.toString() ? styles.filterBtnActive : {})
              }}
            >
              {stars} ★
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Cards */}
      <div style={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <strong>{item.studentName}</strong>
                <span style={styles.orderTag}>Order #{item.orderId}</span>
              </div>
              <div style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < item.rating ? '#f59e0b' : 'transparent'}
                    color={i < item.rating ? '#f59e0b' : '#64748b'}
                  />
                ))}
              </div>
            </div>

            <p style={styles.comment}>"{item.comment}"</p>

            <div style={styles.dateTag}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '0.6rem 1.25rem',
    borderRadius: '12px'
  },
  ratingScore: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  ratingCount: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  filterRow: {
    marginBottom: '1.5rem'
  },
  filterGroup: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--bg-secondary)',
    padding: '4px 8px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  filterBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  filterBtnActive: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontWeight: '600'
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1.25rem'
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '130px'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  orderTag: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginLeft: '0.5rem'
  },
  starsRow: {
    display: 'flex',
    gap: '2px'
  },
  comment: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
    marginBottom: '0.75rem',
    fontStyle: 'italic'
  },
  dateTag: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    alignSelf: 'flex-end'
  }
};
