import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ItemCustomizationModal from '../../components/student/ItemCustomizationModal';
import { PageHeader, StatusBadge, EmptyState } from '../../theme/ui';
import {
  Search,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  UtensilsCrossed,
  Tag
} from 'lucide-react';

export default function StudentHome() {
  const {
    menu,
    addToCart,
    currentActiveStudentOrder,
    studentUser
  } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [addedItemToast, setAddedItemToast] = useState(null);

  const categories = [
    'All',
    'Today Special',
    'Main Course',
    'Curries',
    'Hot Drinks',
    'Chocolates',
    'Ice Creams',
    'Desserts'
  ];

  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (vegOnly && !item.isVeg) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      return true;
    });
  }, [menu, selectedCategory, vegOnly, searchQuery]);

  const specials = useMemo(() => {
    return menu.filter((i) => i.category === 'Today Special');
  }, [menu]);

  const handleQuickAdd = (item, e) => {
    e.stopPropagation();
    addToCart(item, null, 1);
    setAddedItemToast(item.name);
    setTimeout(() => setAddedItemToast(null), 2500);
  };

  const hasActiveOrder = currentActiveStudentOrder &&
    currentActiveStudentOrder.status !== 'Collected' &&
    currentActiveStudentOrder.status !== 'Cancelled';

  return (
    <div className="space-y-6">
      {/* Toast Notification (No emojis, semantic colors) */}
      {addedItemToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-surface border border-line-strong rounded-lg shadow-pop px-4 py-3 flex items-center gap-2.5 text-[13px] text-fg animate-in fade-in duration-150"
        >
          <CheckCircle2 size={16} strokeWidth={1.75} className="text-success shrink-0" />
          <span>Added <strong className="font-semibold">{addedItemToast}</strong> to cart.</span>
        </div>
      )}

      {/* Active Order Notice Bar */}
      {hasActiveOrder && (
        <div
          onClick={() => navigate('/track')}
          className="p-3.5 bg-surface border border-accent/40 rounded-lg flex items-center justify-between gap-3 cursor-pointer hover:border-accent transition-colors duration-150"
          role="alert"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-[13px] font-semibold text-fg">
                Active Order: Token {currentActiveStudentOrder.tokenNumber}
              </span>
              <span className="text-[12px] text-fg-muted ml-2 truncate hidden sm:inline">
                Status: {currentActiveStudentOrder.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[12.5px] font-medium text-accent shrink-0">
            <span>View Tracker</span>
            <ChevronRight size={14} strokeWidth={1.75} />
          </div>
        </div>
      )}

      {/* Page Header (Left-aligned, 22px / 600, no emojis) */}
      <PageHeader
        title="Campus Canteen Menu"
        subtitle={`Welcome, ${studentUser.isGuest ? 'Guest Diner' : studentUser.name}. Order ahead and pick up from the counter.`}
        actions={
          <div className="text-[12.5px] text-fg-muted font-medium bg-surface-2 px-3 py-1.5 rounded-md border border-line">
            Loyalty: <span className="text-fg font-semibold tabular-nums">{studentUser.loyaltyPoints}</span> pts
          </div>
        }
      />

      {/* Today's Specials Section */}
      {selectedCategory === 'All' && specials.length > 0 && !searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-fg">
              Daily Kitchen Specials
            </h2>
            <span className="text-[12px] text-fg-muted font-medium uppercase tracking-wider">
              Limited Availability
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specials.map((sp) => (
              <div
                key={sp.itemId}
                onClick={() => setCustomizingItem(sp)}
                className="card p-0 overflow-hidden flex flex-col cursor-pointer group"
              >
                <div className="h-40 w-full overflow-hidden bg-surface-2 relative">
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="w-full h-full object-cover transition-opacity duration-150 group-hover:opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        sp.isVeg
                          ? 'bg-success/90 text-white'
                          : 'bg-danger/90 text-white'
                      }`}
                    >
                      {sp.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                    <Clock size={11} strokeWidth={1.75} />
                    <span>{sp.prepTime} min</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-fg line-clamp-1">
                      {sp.name}
                    </h3>
                    <p className="text-[12px] text-fg-muted mt-0.5">
                      Chef recommendation for today's meal
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line">
                    <span className="text-[16px] font-semibold text-fg tabular-nums">
                      ₹{sp.price}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(sp, e)}
                      className="btn-primary btn-sm"
                    >
                      <Plus size={14} strokeWidth={1.75} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter and Search Bar Row */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input with 14px text */}
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.75}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
            />
            <input
              type="text"
              placeholder="Search food by name, rice, beverages, curry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 text-[14px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-fg-muted hover:text-fg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Veg Only Toggle */}
          <button
            type="button"
            onClick={() => setVegOnly(!vegOnly)}
            className={`btn-secondary h-9 px-3 text-[13px] shrink-0 gap-2 ${
              vegOnly ? 'border-success text-success bg-success/5' : ''
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                vegOnly ? 'bg-success' : 'bg-fg-subtle'
              }`}
            />
            <span>Vegetarian only</span>
          </button>
        </div>

        {/* Category Pills (horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`h-8 px-3 rounded-md text-[12.5px] font-medium whitespace-nowrap border transition-colors duration-150 ${
                  isSelected
                    ? 'bg-accent-soft text-accent border-accent font-semibold'
                    : 'bg-surface text-fg-muted border-line hover:bg-surface-2 hover:text-fg'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Menu Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-fg">
            {selectedCategory === 'All' ? 'All Items' : selectedCategory}
          </h2>
          <span className="text-[12.5px] text-fg-muted tabular-nums">
            {filteredItems.length} items available
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No items found"
            description="No menu items matched your selected filters or search term."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setVegOnly(false);
                }}
                className="btn-secondary btn-sm"
              >
                Reset filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.itemId}
                onClick={() => setCustomizingItem(item)}
                className="card p-0 overflow-hidden flex flex-col cursor-pointer group"
              >
                <div className="h-44 w-full overflow-hidden bg-surface-2 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-opacity duration-150 group-hover:opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        item.isVeg
                          ? 'bg-success/90 text-white'
                          : 'bg-danger/90 text-white'
                      }`}
                    >
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                    <Clock size={11} strokeWidth={1.75} />
                    <span>{item.prepTime || 8} min</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted block">
                      {item.category}
                    </span>
                    <h3 className="text-[14px] font-semibold text-fg mt-0.5 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line">
                    <span className="text-[16px] font-semibold text-fg tabular-nums">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomizingItem(item);
                        }}
                        className="btn-secondary btn-sm"
                      >
                        Customize
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(item, e)}
                        className="btn-primary btn-sm"
                      >
                        <Plus size={14} strokeWidth={1.75} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Item Customization Modal */}
      {customizingItem && (
        <ItemCustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={(item, customization, qty) => {
            addToCart(item, customization, qty);
            setAddedItemToast(`${qty}x ${item.name}`);
            setTimeout(() => setAddedItemToast(null), 2500);
          }}
        />
      )}
    </div>
  );
}
