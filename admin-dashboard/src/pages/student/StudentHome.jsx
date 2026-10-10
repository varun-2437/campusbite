import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ItemCustomizationModal from '../../components/student/ItemCustomizationModal';
import {
  Search,
  Sparkles,
  Flame,
  Clock,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  ThumbsUp
} from 'lucide-react';

export default function StudentHome() {
  const {
    menu,
    addToCart,
    currentActiveStudentOrder,
    studentUser,
    activeStudentOrderId
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

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Veg only
      if (vegOnly && !item.isVeg) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      return true;
    });
  }, [menu, selectedCategory, vegOnly, searchQuery]);

  // Specials items for carousel
  const specials = useMemo(() => {
    return menu.filter((i) => i.category === 'Today Special');
  }, [menu]);

  const handleQuickAdd = (item, e) => {
    e.stopPropagation();
    addToCart(item, null, 1);
    setAddedItemToast(item.name);
    setTimeout(() => setAddedItemToast(null), 2500);
  };

  const handleOpenCustomization = (item) => {
    setCustomizingItem(item);
  };

  const hasActiveOrder = currentActiveStudentOrder &&
    currentActiveStudentOrder.status !== 'Collected' &&
    currentActiveStudentOrder.status !== 'Cancelled';

  return (
    <div style={styles.container}>
      {/* Toast Notification for quick add */}
      {addedItemToast && (
        <div style={styles.toast}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>Added <strong>{addedItemToast}</strong> to cart!</span>
        </div>
      )}

      {/* Active Order Banner if active */}
      {hasActiveOrder && (
        <div
          style={styles.activeOrderBanner}
          onClick={() => navigate('/track')}
          title="Click to track live order"
        >
          <div style={styles.bannerLeft}>
            <div style={styles.pulsingBeacon} />
            <div>
              <div style={styles.bannerTitle}>
                Active Order: Token {currentActiveStudentOrder.tokenNumber} ({currentActiveStudentOrder.status})
              </div>
              <div style={styles.bannerSubtitle}>
                {currentActiveStudentOrder.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
              </div>
            </div>
          </div>
          <div style={styles.bannerRight}>
            <span style={styles.trackText}>Live Stepper</span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}

      {/* Hero Welcome & Specials Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.greetingPill}>
            <Sparkles size={14} color="var(--accent-primary)" />
            <span>Welcome, {studentUser.isGuest ? 'Guest Diner' : studentUser.name}</span>
          </div>
          <h1 style={styles.heroHeading}>
            Fresh Campus Meals, <br />
            <span style={{ color: 'var(--accent-primary)' }}>Zero Waiting in Queues</span>
          </h1>
          <p style={styles.heroSubtext}>
            Order ahead from your phone or laptop. Get a digital token, pick up hot & fresh from your counter.
          </p>
        </div>

        {/* Today's Specials Carousel */}
        <div style={styles.specialsBlock}>
          <div style={styles.specialsHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={18} color="#ef4444" />
              <h3 style={styles.specialsTitle}>Today's Chef Specials</h3>
            </div>
            <span style={styles.specialsBadge}>Exclusive Deal</span>
          </div>

          <div style={styles.specialsScroll}>
            {specials.map((sp) => (
              <div
                key={sp.itemId}
                style={styles.specialCard}
                onClick={() => handleOpenCustomization(sp)}
              >
                <div style={styles.specialImgWrap}>
                  <img src={sp.imageUrl} alt={sp.name} style={styles.specialImg} />
                  <div style={styles.specialPriceBadge}>₹{sp.price}</div>
                  <div style={styles.specialVegBadge}>
                    <span className={sp.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                  </div>
                </div>
                <div style={styles.specialInfo}>
                  <div style={styles.specialName}>{sp.name}</div>
                  <div style={styles.specialMeta}>
                    <span>⏱️ {sp.prepTime} mins</span>
                    <button
                      onClick={(e) => handleQuickAdd(sp, e)}
                      style={styles.quickAddBtn}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Filter Controls & Search */}
      <section style={styles.filterSection}>
        {/* Search Input Bar */}
        <div style={styles.searchBar}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search delicious dishes, biryani, coffee, burgers, shakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills & Veg Toggle */}
        <div style={styles.filterRow}>
          <div style={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.catPill,
                  backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              ...styles.vegToggleBtn,
              backgroundColor: vegOnly ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
              borderColor: vegOnly ? '#10b981' : 'var(--border-color)',
              color: vegOnly ? '#10b981' : 'var(--text-secondary)'
            }}
          >
            <span className="veg-badge" />
            <span>Pure Veg Only</span>
          </button>
        </div>
      </section>

      {/* Food Items Grid */}
      <section style={styles.menuGridSection}>
        <div style={styles.gridHeader}>
          <h2 style={styles.sectionHeading}>
            {selectedCategory === 'All' ? 'Full Campus Menu' : selectedCategory}
          </h2>
          <span style={styles.itemCountText}>
            Showing {filteredItems.length} delicious choices
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No items match your search or filter</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Try clearing the search query or switching categories.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredItems.map((item) => (
              <div
                key={item.itemId}
                style={styles.itemCard}
                onClick={() => handleOpenCustomization(item)}
              >
                <div style={styles.itemImgWrap}>
                  <img src={item.imageUrl} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemBadgeRow}>
                    <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                    <span style={styles.itemPrepPill}>⏱️ {item.prepTime || 8}m</span>
                  </div>
                </div>

                <div style={styles.itemBody}>
                  <div style={styles.itemCategory}>{item.category}</div>
                  <h3 style={styles.itemTitle}>{item.name}</h3>

                  <div style={styles.itemFooter}>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                    <div style={styles.cardActions}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCustomization(item);
                        }}
                        style={styles.customizeBtn}
                        title="Customize toppings & instructions"
                      >
                        Customize
                      </button>
                      <button
                        onClick={(e) => handleQuickAdd(item, e)}
                        style={styles.addBtn}
                        title="Quick add to cart"
                      >
                        <Plus size={16} />
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

const styles = {
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem',
    minHeight: '100vh'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#18233c',
    border: '1px solid #10b981',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    zIndex: 2000,
    animation: 'slideUp 0.25s ease-out',
    fontSize: '0.88rem'
  },
  activeOrderBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '14px',
    padding: '0.9rem 1.25rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  bannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  pulsingBeacon: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 10px #10b981',
    animation: 'pulse 1.8s infinite'
  },
  bannerTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#10b981'
  },
  bannerSubtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    maxWidth: '500px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  bannerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: '#10b981',
    fontSize: '0.82rem',
    fontWeight: '600'
  },
  trackText: {
    marginRight: '2px'
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'var(--bg-secondary)',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid var(--border-color)'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  greetingPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    color: 'var(--accent-primary)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    width: 'fit-content'
  },
  heroHeading: {
    fontSize: '2rem',
    fontWeight: '800',
    lineHeight: 1.2,
    letterSpacing: '-0.5px'
  },
  heroSubtext: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    maxWidth: '480px'
  },
  specialsBlock: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid var(--border-color)'
  },
  specialsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.85rem'
  },
  specialsTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  specialsBadge: {
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '8px'
  },
  specialsScroll: {
    display: 'flex',
    gap: '0.85rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
  },
  specialCard: {
    minWidth: '190px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  specialImgWrap: {
    position: 'relative',
    height: '110px',
    width: '100%'
  },
  specialImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  specialPriceBadge: {
    position: 'absolute',
    bottom: '6px',
    left: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '6px'
  },
  specialVegBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: '4px',
    borderRadius: '4px'
  },
  specialInfo: {
    padding: '0.75rem'
  },
  specialName: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  specialMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px',
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  quickAddBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  filterSection: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem'
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.92rem'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  categoryPills: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    flex: 1,
    paddingBottom: '4px'
  },
  catPill: {
    padding: '7px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.82rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  vegToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '7px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  menuGridSection: {
    marginTop: '1rem'
  },
  gridHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  sectionHeading: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  itemCountText: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)'
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    border: '1px dashed var(--border-color)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  itemCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  itemImgWrap: {
    position: 'relative',
    height: '170px',
    width: '100%'
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  itemBadgeRow: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'none'
  },
  itemPrepPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  itemBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  itemCategory: {
    fontSize: '0.72rem',
    color: 'var(--accent-secondary)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  itemTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '4px 0 0.85rem 0',
    lineHeight: 1.3
  },
  itemFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  itemPrice: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  customizeBtn: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    backgroundColor: 'transparent',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer'
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
  }
};
