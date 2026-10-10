import React, { useState } from 'react';
import { X, Star, CheckCircle2, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function FeedbackModal({ orderId, tokenNumber, onClose }) {
  const { submitFeedback, studentUser } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Good Taste', 'Fast Prep']);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'Good Taste',
    'Served Hot',
    'Fast Prep',
    'Generous Portion',
    'Clean Packaging',
    'Courteous Staff'
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
      comment: comment || 'Food was fresh and served in good time.',
      tags: selectedTags,
      studentName: studentUser.name
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[460px] bg-surface border border-line rounded-xl shadow-pop overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-fg">
              Food & Service Feedback
            </h2>
            <p className="text-[12px] text-fg-muted mt-0.5">
              Token {tokenNumber} ({orderId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost w-8 h-8 p-0 rounded"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-fg">
                Feedback Recorded
              </h3>
              <p className="text-[13px] text-fg-muted mt-1">
                Your rating has been submitted to the canteen manager. 15 loyalty points have been credited to your account.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary w-full btn-sm h-9"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Star Rating */}
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-1.5" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 rounded text-fg-muted hover:text-warning transition-colors"
                    aria-label={`${star} of 5 stars`}
                  >
                    <Star
                      size={28}
                      strokeWidth={1.75}
                      className={
                        (hoverRating || rating) >= star
                          ? 'fill-warning text-warning'
                          : 'text-line-strong'
                      }
                    />
                  </button>
                ))}
              </div>
              <div className="text-[12.5px] font-medium text-fg-muted">
                {rating === 5 && '5/5 - Excellent'}
                {rating === 4 && '4/5 - Good'}
                {rating === 3 && '3/5 - Average'}
                {rating === 2 && '2/5 - Fair'}
                {rating === 1 && '1/5 - Poor'}
              </div>
            </div>

            {/* Quality Tags */}
            <div className="space-y-2">
              <label className="label">
                Positive Highlights
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[12px] px-2.5 py-1 rounded-md border transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent-soft text-accent font-medium'
                          : 'border-line bg-surface hover:bg-surface-2 text-fg-muted'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="feedback-comment" className="label">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                placeholder="Share any comments on taste, temperature or service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input h-auto py-2 text-[14px] resize-y"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary w-full h-9 text-[13px]"
            >
              <span>Submit Feedback (+15 pts)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
