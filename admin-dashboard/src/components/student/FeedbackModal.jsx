import React, { useState } from 'react';
import { X, Star, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function FeedbackModal({ orderId, tokenNumber, onClose }) {
  const { submitFeedback, studentUser } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Delicious Taste', 'Hot & Fresh']);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'Delicious Taste',
    'Hot & Fresh',
    'Super Fast Prep',
    'Generous Portion',
    'Clean Packaging',
    'Polite Staff',
    'Authentic Spices'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    submitFeedback({
      orderId,
      rating,
      comment: comment || 'Food was delicious and served on time!',
      tags: selectedTags,
      studentName: studentUser.name
    });
    setSubmitted(true);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Rate Your Food Experience</h3>
            <span style={styles.subtitle}>Order Token: {tokenNumber} ({orderId})</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={styles.successContent}>
            <div style={styles.awardCircle}>
              <Award size={40} color="#10b981" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '1rem' }}>
              Thank You for Your Feedback!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Your review helps our canteen kitchen improve and serve better meals every day.
            </p>
            <div style={styles.pointsBadge}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span>+15 Loyalty Points Added to Your Balance!</span>
            </div>
            <button onClick={onClose} style={styles.doneBtn}>
              Done
            </button>
          </div>
        ) : (
          <div style={styles.body}>
            {/* Star Rating Selector */}
            <div style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={styles.starBtn}
                >
                  <Star
                    size={32}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : 'var(--text-muted)'}
                  />
                </button>
              ))}
            </div>
            <div style={styles.ratingText}>
              {rating === 5 && 'Outstanding! 🌟🌟🌟🌟🌟'}
              {rating === 4 && 'Very Good & Tasty! 🌟🌟🌟🌟'}
              {rating === 3 && 'Decent / Average 🌟🌟🌟'}
              {rating === 2 && 'Needs Improvement 🌟🌟'}
              {rating === 1 && 'Poor Experience 🌟'}
            </div>

            {/* Quality Tags */}
            <div style={{ marginTop: '1.25rem' }}>
              <label style={styles.label}>What did you like the most?</label>
              <div style={styles.tagGrid}>
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        ...styles.tagBtn,
                        backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-secondary)',
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {isSelected && '✓ '} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Textarea */}
            <div style={{ marginTop: '1.25rem' }}>
              <label style={styles.label}>Write a review or comment for the chef (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on food quality, temperature, flavors..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={styles.textarea}
              />
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} style={styles.submitBtn}>
              <span>Submit Review & Claim 15 Pts</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1400,
    padding: '1rem'
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '460px',
    boxShadow: 'var(--shadow-lg)'
  },
  header: {
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  closeBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  body: {
    padding: '1.5rem'
  },
  starsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem'
  },
  starBtn: {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px'
  },
  ratingText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--accent-warning)',
    marginTop: '0.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem'
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem'
  },
  tagBtn: {
    padding: '5px 10px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    resize: 'vertical'
  },
  submitBtn: {
    width: '100%',
    marginTop: '1.25rem',
    padding: '0.85rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
  },
  successContent: {
    padding: '3rem 2rem',
    textAlign: 'center'
  },
  awardCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  pointsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    color: 'var(--accent-primary)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginTop: '1.25rem'
  },
  doneBtn: {
    display: 'block',
    width: '100%',
    marginTop: '1.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    fontWeight: '600',
    border: '1px solid var(--border-color)',
    cursor: 'pointer'
  }
};
