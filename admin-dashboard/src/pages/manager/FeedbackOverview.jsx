import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Star, Filter, ThumbsUp, Calendar, Hash } from 'lucide-react';

export default function FeedbackOverview() {
  const { feedbackList } = useStore();
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const filtered = feedbackList.filter((fb) => {
    if (ratingFilter === 'ALL') return true;
    return fb.rating === Number(ratingFilter);
  });

  const avgRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / feedbackList.length).toFixed(1)
    : '5.0';

  const starCounts = {
    5: feedbackList.filter((f) => f.rating === 5).length,
    4: feedbackList.filter((f) => f.rating === 4).length,
    3: feedbackList.filter((f) => f.rating === 3).length,
    2: feedbackList.filter((f) => f.rating === 2).length,
    1: feedbackList.filter((f) => f.rating === 1).length
  };

  return (
    <div className="space-y-6">
      {/* Header & Rating Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Student & Customer Feedback</h1>
          <p className="text-sm text-fg-muted">
            Ratings and reviews submitted after order collection
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface border border-line rounded-xl px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star size={22} fill="currentColor" />
            <span className="text-xl font-bold text-fg">{avgRating}</span>
            <span className="text-xs text-fg-muted font-medium">/ 5.0</span>
          </div>
          <div className="h-6 w-px bg-line" />
          <span className="text-xs font-semibold text-fg-muted">
            {feedbackList.length} verified reviews
          </span>
        </div>
      </div>

      {/* Filter Bar with High Contrast Tabs */}
      <div className="flex items-center gap-1.5 bg-surface border border-line rounded-xl p-1.5 shadow-sm flex-wrap">
        <div className="pl-2 pr-1 text-fg-muted">
          <Filter size={15} />
        </div>
        <button
          onClick={() => setRatingFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            ratingFilter === 'ALL'
              ? 'bg-accent text-white font-semibold shadow-sm'
              : 'text-fg-muted hover:text-fg hover:bg-surface-2'
          }`}
        >
          All Ratings ({feedbackList.length})
        </button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            onClick={() => setRatingFilter(stars.toString())}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              ratingFilter === stars.toString()
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <span>{stars} Stars</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                ratingFilter === stars.toString()
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-2 text-fg-muted'
              }`}
            >
              {starCounts[stars] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback List or Empty State */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 flex flex-col items-center justify-center gap-3 border-dashed border-2 bg-surface">
          <div className="p-3 bg-surface-2 rounded-full text-amber-500">
            <Star size={40} />
          </div>
          <h3 className="text-base font-semibold text-fg">
            No {ratingFilter}-Star Reviews Found
          </h3>
          <p className="text-xs text-fg-muted max-w-sm">
            There are currently no reviews with a {ratingFilter}-star rating.
          </p>
          <button
            onClick={() => setRatingFilter('ALL')}
            className="mt-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            View All Reviews
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const initials = item.studentName
              ? item.studentName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'ST';

            return (
              <div
                key={item.id}
                className="card bg-surface border border-line rounded-xl p-5 shadow-sm hover:shadow-md hover:border-line-strong transition flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-fg text-sm leading-tight">
                          {item.studentName}
                        </div>
                        <span className="text-[11px] font-mono text-fg-muted">
                          Order #{item.orderId}
                        </span>
                      </div>
                    </div>

                    {/* Star row */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < item.rating ? '#f59e0b' : 'none'}
                          className={i < item.rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-fg leading-relaxed italic border-l-2 border-teal-500/40 pl-2.5 my-2">
                    "{item.comment}"
                  </p>
                </div>

                {/* Footer date */}
                <div className="pt-2 mt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-fg-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <ThumbsUp size={11} />
                    Verified Dine-in
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
