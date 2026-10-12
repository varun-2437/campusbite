import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import QRCodeView from '../../components/common/QRCodeView';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  User,
  Star,
  Search,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  Award,
  ArrowRight,
  Shield,
  CreditCard,
  Banknote,
  RotateCcw,
  Smartphone,
  ChevronRight,
  Layers
} from 'lucide-react';

export default function StudentApp() {
  const { menu, orders, addWalkInOrder, updateOrderStatus } = useStore();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Responsive device view & live simulated clock
  const [isMobileScreen, setIsMobileScreen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 600
  );
  const [deviceTime, setDeviceTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    const clockTimer = setInterval(() => {
      setDeviceTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(clockTimer);
    };
  }, []);

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'menu' | 'cart' | 'orders' | 'profile'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' | 'Cash'

  // Payment mock screen state
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [paymentFailedNotice, setPaymentFailedNotice] = useState(false);

  // Feedback modal
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const isGuest = !user || user.role === 'guest';
  const isStudent = !isGuest && user?.role === 'student';
  const loyaltyPoints = user?.loyaltyPoints || 0;

  // Categories (Authentic Digital Board categories)
  const categories = [
    'All',
    'Main Course',
    'Today Special',
    'Curries',
    'Bakes & Snacks',
    'Sweets & Puddings',
    'Hot Drinks',
    'Juices & Milkshakes',
    'Ice Creams'
  ];

  // Filtered menu
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !vegOnly || item.isVeg;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  // Cart helpers
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.itemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'CAMPUS20' && subtotal >= 100) {
      setDiscount(20);
      alert('Coupon CAMPUS20 applied: ₹20 Discount!');
    } else if (clean === 'WELCOME50' && subtotal >= 150) {
      setDiscount(50);
      alert('Coupon WELCOME50 applied: ₹50 Discount!');
    } else {
      alert('Invalid coupon or minimum order amount not met.');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const newOrder = addWalkInOrder({
      customerName: user?.name || 'Student (App)',
      items: cart,
      totalAmount: total,
      paymentMethod,
      priority: 'Normal',
      specialInstructions,
      category: cart.some((i) => i.category === 'Main Course' || i.category === 'Curries' || i.category === 'Today Special')
        ? 'Food'
        : 'Beverage'
    });

    setCart([]);
    setDiscount(0);
    setCouponCode('');

    if (paymentMethod === 'Online') {
      setPaymentModalOrder(newOrder);
    } else {
      setActiveTab('orders');
    }
  };

  // Payment mock simulation actions
  const handlePaymentOutcome = (isSuccess) => {
    if (isSuccess) {
      setPaymentModalOrder(null);
      setPaymentFailedNotice(false);
      setActiveTab('orders');
    } else {
      setPaymentFailedNotice(true);
    }
  };

  // Recent / Active orders
  const activeOrders = orders.filter((o) => o.status !== 'Collected' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Collected' || o.status === 'Cancelled');

  return (
    <div style={isMobileScreen ? styles.mobileContainer : styles.outerContainer}>
      {/* LAPTOP DESKTOP VIEW: Realistic Device Simulator Header Bar */}
      {!isMobileScreen && (
        <div style={styles.simulatorToolbar}>
          <div style={styles.simBadge}>
            <span style={styles.simPulseDot} />
            <span style={{ fontWeight: '700' }}>📱 Mobile Format Active</span>
            <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              • iPhone 15 Pro Max Simulator
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/cashier')}
              style={styles.toolbarBtn}
              title="Open Staff POS & Management Dashboard"
            >
              🖥️ Switch to Staff Portal
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              style={{ ...styles.toolbarBtn, backgroundColor: '#334155' }}
              title="Change User / Test Different Roles"
            >
              👤 Switch User ({user?.name ? user.name.split(' ')[0] : 'Guest'})
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{ ...styles.toolbarBtn, backgroundColor: '#1e293b', border: '1px solid #475569' }}
              title="Return to Login Gateway"
            >
              🔐 Auth
            </button>
          </div>
        </div>
      )}

      {/* THE PHONE FRAME */}
      <div style={isMobileScreen ? styles.mobileFrame : styles.phoneFrame}>
        {/* LAPTOP ONLY: Dynamic Island Pill Notch */}
        {!isMobileScreen && (
          <div style={styles.dynamicIslandContainer}>
            <div style={styles.dynamicIslandPill}>
              <div style={styles.cameraLens} />
              <div style={styles.sensorDot} />
            </div>
          </div>
        )}

        {/* Top Status Bar Indicator */}
        <div style={styles.statusBar}>
          <span style={styles.timeText}>{deviceTime}</span>
          <div style={styles.statusIcons}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>●●●●</span>
            <span style={{ fontSize: '0.75rem', marginLeft: '6px', fontWeight: '700' }}>5G</span>
            <div style={styles.batteryContainer}>
              <div style={styles.batteryFill} />
            </div>
          </div>
        </div>

        {/* Guest Banner if not signed in */}
        {isGuest && (
          <div style={styles.guestBanner}>
            <Sparkles size={14} color="#f97316" />
            <span style={{ flex: 1, fontSize: '0.75rem' }}>
              Guest Mode: Sign in to save receipts & earn points
            </span>
            <button
              onClick={() => setShowAuthModal(true)}
              style={styles.signInSmallBtn}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Tab 1: HOME DASHBOARD */}
        {activeTab === 'home' && (
          <div style={styles.scrollContent}>
            {/* Header Greeting */}
            <div style={styles.headerRow}>
              <div>
                <h2 style={styles.greetingTitle}>Hello, {user?.name || (isGuest ? 'Guest Diner' : 'Student')} 👋</h2>
                <p style={styles.greetingSubtitle}>What are you craving today?</p>
              </div>
              {isStudent && (
                <div style={styles.pointsBadge}>
                  <Award size={16} color="#f59e0b" />
                  <span>{loyaltyPoints} Pts</span>
                </div>
              )}
            </div>

            {/* Pinned Active Order Card (If Any) */}
            {activeOrders.length > 0 && (
              <div
                onClick={() => setActiveTab('orders')}
                style={styles.activeOrderBanner}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.tokenPill}>{activeOrders[0].tokenNumber}</span>
                  <span style={styles.activeStatusPill}>{activeOrders[0].status}</span>
                </div>
                <h4 style={{ margin: '0.5rem 0 0.2rem 0', fontSize: '0.95rem' }}>
                  {activeOrders[0].items[0]?.name}
                  {activeOrders[0].items.length > 1 ? ` +${activeOrders[0].items.length - 1} more` : ''}
                </h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Tap to track live preparation timeline →
                </p>
              </div>
            )}

            {/* Specials Carousel */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Today's Specials 🔥</h3>
                <span onClick={() => { setSelectedCategory('Today Special'); setActiveTab('menu'); }} style={styles.seeAll}>See All</span>
              </div>
              <div style={styles.specialsCarousel}>
                {menu
                  .filter((i) => i.category === 'Today Special')
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.itemId} style={styles.specialCard}>
                      <img src={item.imageUrl} alt={item.name} style={styles.specialImage} />
                      <div style={styles.specialCardBody}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={item.isVeg ? styles.vegPill : styles.nonVegPill}>
                            {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                          </span>
                          <span style={styles.specialPrice}>{formatCurrency(item.price)}</span>
                        </div>
                        <h4 style={styles.specialName}>{item.name}</h4>
                        <button onClick={() => addToCart(item)} style={styles.quickAddBtn}>
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Category Quick Chips */}
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={styles.sectionTitle}>Explore Categories</h3>
              <div style={styles.categoryGrid}>
                {categories.slice(1, 5).map((cat) => (
                  <div
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setActiveTab('menu'); }}
                    style={styles.categoryChipCard}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {cat === 'Main Course' ? '🍛' : cat === 'Curries' ? '🍲' : cat === 'Hot Drinks' ? '☕' : '✨'}
                    </span>
                    <span style={styles.categoryChipLabel}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MENU BROWSING */}
        {activeTab === 'menu' && (
          <div style={styles.scrollContent}>
            {/* Search and Veg Toggle */}
            <div style={styles.searchContainer}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search biryani, drinks, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Category Horizontal Pills */}
            <div style={styles.pillsScroll}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.pillBtn,
                    backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : '#1e293b',
                    color: selectedCategory === cat ? '#fff' : '#94a3b8'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Veg Switch */}
            <div style={styles.filterRow}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Showing {filteredMenu.length} dishes
              </span>
              <button
                onClick={() => setVegOnly(!vegOnly)}
                style={{
                  ...styles.vegToggleBtn,
                  backgroundColor: vegOnly ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: vegOnly ? '#10b981' : '#94a3b8'
                }}
              >
                ● Veg Only
              </button>
            </div>

            {/* Menu Items List */}
            <div style={styles.menuItemsList}>
              {filteredMenu.map((item) => (
                <div key={item.itemId} style={styles.dishCard}>
                  <img src={item.imageUrl} alt={item.name} style={styles.dishImage} />
                  <div style={styles.dishInfo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={item.isVeg ? styles.vegPill : styles.nonVegPill}>
                        {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                      </span>
                      <span style={styles.dishCategoryPill}>{item.category}</span>
                    </div>
                    <h4 style={styles.dishName}>{item.name}</h4>
                    <span style={styles.prepTimeText}>Prep: ~{item.prepTime} mins</span>
                    <div style={styles.dishBottomRow}>
                      <span style={styles.dishPrice}>{formatCurrency(item.price)}</span>
                      <button
                        onClick={() => addToCart(item)}
                        style={styles.dishAddBtn}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: CART & CHECKOUT */}
        {activeTab === 'cart' && (
          <div style={styles.scrollContent}>
            <h2 style={styles.screenHeading}>Your Food Cart ({cart.length})</h2>

            {cart.length === 0 ? (
              <div style={styles.emptyCartBox}>
                <ShoppingBag size={56} color="#64748b" />
                <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
                  Your cart is empty. Add delicious items from the menu!
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={styles.browseMenuBtn}
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div>
                {/* Cart Items */}
                <div style={styles.cartList}>
                  {cart.map((item) => (
                    <div key={item.itemId} style={styles.cartItemRow}>
                      <div style={{ flex: 1 }}>
                        <h4 style={styles.cartItemTitle}>{item.name}</h4>
                        <span style={styles.cartItemUnitPrice}>
                          {formatCurrency(item.price)} each
                        </span>
                      </div>
                      <div style={styles.qtyControl}>
                        <button
                          onClick={() => updateQuantity(item.itemId, -1)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={styles.qtyNum}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.itemId, 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={styles.cartItemTotal}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div style={styles.couponCard}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. CAMPUS20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={styles.couponInput}
                  />
                  <button onClick={applyCoupon} style={styles.couponApplyBtn}>
                    Apply
                  </button>
                </div>

                {/* Special Instructions */}
                <div style={{ margin: '1rem 0' }}>
                  <input
                    type="text"
                    placeholder="Kitchen instructions (e.g. Less spicy)"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    style={styles.instructionsInput}
                  />
                </div>

                {/* Payment Method Selector */}
                <h4 style={styles.subHeading}>Choose Payment Method</h4>
                <div style={styles.paymentMethodRow}>
                  <div
                    onClick={() => setPaymentMethod('Online')}
                    style={{
                      ...styles.paymentOptionCard,
                      borderColor: paymentMethod === 'Online' ? 'var(--accent-primary)' : '#334155',
                      backgroundColor: paymentMethod === 'Online' ? 'rgba(249, 115, 22, 0.1)' : '#1e293b'
                    }}
                  >
                    <CreditCard size={20} color="#3b82f6" />
                    <span style={styles.paymentOptionTitle}>Online (Razorpay)</span>
                    <span style={styles.paymentOptionSubtitle}>Instant verification</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Cash')}
                    style={{
                      ...styles.paymentOptionCard,
                      borderColor: paymentMethod === 'Cash' ? 'var(--accent-primary)' : '#334155',
                      backgroundColor: paymentMethod === 'Cash' ? 'rgba(249, 115, 22, 0.1)' : '#1e293b'
                    }}
                  >
                    <Banknote size={20} color="#10b981" />
                    <span style={styles.paymentOptionTitle}>Cash at Counter</span>
                    <span style={styles.paymentOptionSubtitle}>Pay at POS</span>
                  </div>
                </div>

                {/* Bill Summary */}
                <div style={styles.billSummaryCard}>
                  <div style={styles.billRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ ...styles.billRow, color: '#10b981' }}>
                      <span>Discount ({couponCode})</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div style={styles.billDivider} />
                  <div style={styles.billTotalRow}>
                    <span>Total Payable</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  style={styles.checkoutSubmitBtn}
                >
                  Place Order • {formatCurrency(total)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: LIVE ORDER TRACKING & HISTORY */}
        {activeTab === 'orders' && (
          <div style={styles.scrollContent}>
            <h2 style={styles.screenHeading}>Order Tracking & Receipts</h2>

            {/* Active Order Card */}
            {activeOrders.length > 0 && (
              <div style={styles.trackingCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={styles.tokenLargeBadge}>{activeOrders[0].tokenNumber}</span>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                      {activeOrders[0].orderId}
                    </div>
                  </div>
                  <span style={styles.activeStatusPill}>{activeOrders[0].status}</span>
                </div>

                {/* Stepper Timeline */}
                <div style={styles.stepperContainer}>
                  {['Pending', 'Preparing', 'Ready', 'Collected'].map((step, idx) => {
                    const steps = ['Pending', 'Preparing', 'Ready', 'Collected'];
                    const currentIdx = steps.indexOf(activeOrders[0].status);
                    const isDone = currentIdx >= idx;

                    return (
                      <div key={step} style={styles.stepItem}>
                        <div
                          style={{
                            ...styles.stepDot,
                            backgroundColor: isDone ? 'var(--accent-primary)' : '#334155',
                            borderColor: isDone ? '#f97316' : '#475569'
                          }}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            marginTop: '4px',
                            color: isDone ? '#fff' : '#64748b',
                            fontWeight: isDone ? '600' : 'normal'
                          }}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items in active order */}
                <div style={styles.orderItemsSnippet}>
                  {activeOrders[0].items.map((i, idx) => (
                    <span key={idx} style={styles.snippetChip}>
                      {i.name} (x{i.quantity})
                    </span>
                  ))}
                </div>

                {/* Dynamic Scannable QR Pass */}
                <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
                  <QRCodeView
                    value={`CAMPUSBITE:${activeOrders[0].orderId}:${activeOrders[0].tokenNumber}`}
                    tokenNumber={activeOrders[0].tokenNumber}
                    size={140}
                    caption="Show at pickup counter for meal handover"
                    status={activeOrders[0].status}
                  />
                </div>

                {/* Simulation status advance button */}
                <button
                  onClick={() => {
                    const next =
                      activeOrders[0].status === 'Pending'
                        ? 'Preparing'
                        : activeOrders[0].status === 'Preparing'
                        ? 'Ready'
                        : 'Collected';
                    updateOrderStatus(activeOrders[0].orderId, next);
                    if (next === 'Collected') {
                      setFeedbackOrderId(activeOrders[0].orderId);
                    }
                  }}
                  style={styles.advanceSimBtn}
                >
                  <RotateCcw size={14} />
                  <span>Simulate Next Stage ({activeOrders[0].status} → Next)</span>
                </button>
              </div>
            )}

            {/* Past Orders History */}
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '1.25rem 0 0.75rem 0' }}>
              Past Invoices ({pastOrders.length})
            </h3>
            {pastOrders.map((ord) => (
              <div key={ord.orderId} style={styles.pastOrderCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{ord.tokenNumber} • {ord.orderId}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                    {formatCurrency(ord.totalAmount)}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0' }}>
                  {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.status}</span>
                  <button
                    onClick={() => {
                      ord.items.forEach((i) => addToCart(i));
                      setActiveTab('cart');
                    }}
                    style={styles.reorderSmallBtn}
                  >
                    Reorder Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: PROFILE & REWARDS */}
        {activeTab === 'profile' && (
          <div style={styles.scrollContent}>
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>{user?.name?.charAt(0) || 'S'}</div>
              <h3 style={{ margin: '0.5rem 0 0.1rem 0' }}>{user?.name || 'Student User'}</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {user?.email || 'student@campusbite.com'}
              </span>
            </div>

            {/* Loyalty Points Card */}
            {isStudent ? (
              <div style={styles.pointsCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={22} color="#f59e0b" />
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>CampusBite Rewards</h4>
                </div>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0.2rem 0', color: '#f59e0b' }}>
                  {loyaltyPoints} Points
                </h2>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Earn 10 points for every ₹100 spent on cafeteria orders.
                </p>
              </div>
            ) : (
              <div style={styles.pointsCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={22} color="#94a3b8" />
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Student Rewards Program</h4>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Sign in with a student account to collect 10 points for every ₹100 spent and redeem discount vouchers.
                </p>
              </div>
            )}

            {/* Settings Options */}
            <div style={styles.profileOptionsList}>
              <div style={styles.profileOptionRow}>
                <span>Saved Payment Methods</span>
                <span style={{ color: '#94a3b8' }}>UPI / Cards ›</span>
              </div>
              <div style={styles.profileOptionRow}>
                <span>Notification Preferences</span>
                <span style={{ color: '#10b981' }}>Enabled ›</span>
              </div>
              <div style={styles.profileOptionRow}>
                <span>Terms & Food Safety</span>
                <span style={{ color: '#94a3b8' }}>View ›</span>
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              style={styles.switchUserFullBtn}
            >
              👤 Switch User Profile / Role
            </button>

            <button
              onClick={() => {
                logout();
                alert('Logged out. Switched to guest mode.');
              }}
              style={styles.logoutFullBtn}
            >
              Sign Out
            </button>
          </div>
        )}

        {/* MOCK PAYMENT SCREEN MODAL (SUCCESS / FAILED) */}
        {paymentModalOrder && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <Shield size={36} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                  Mock Payment Gateway
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Simulate Razorpay Transaction Outcome
                </span>
              </div>

              <div style={styles.modalSummaryBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Order ID:</span>
                  <strong>{paymentModalOrder.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '4px' }}>
                  <span>Amount:</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>
                    {formatCurrency(paymentModalOrder.totalAmount)}
                  </strong>
                </div>
              </div>

              {paymentFailedNotice && (
                <div style={styles.paymentFailedAlert}>
                  ⚠️ Transaction Declined by Gateway Simulator. Tap retry or switch to cash.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  onClick={() => handlePaymentOutcome(true)}
                  style={styles.paySuccessBtn}
                >
                  <CheckCircle size={18} />
                  <span>Mark as SUCCESS (Paid)</span>
                </button>

                <button
                  onClick={() => handlePaymentOutcome(false)}
                  style={styles.payFailBtn}
                >
                  <RotateCcw size={18} />
                  <span>Mark as FAILED (Declined)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK MODAL (Post-Collection) */}
        {feedbackOrderId && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>🍲</span>
                <h3 style={{ fontSize: '1.15rem', marginTop: '0.25rem' }}>Rate Your Meal</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Order #{feedbackOrderId} Collected
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    onClick={() => setRating(star)}
                    fill={star <= rating ? '#f59e0b' : 'transparent'}
                    color={star <= rating ? '#f59e0b' : '#64748b'}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>

              <input
                type="text"
                placeholder="How was the food and pickup speed?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={styles.instructionsInput}
              />

              <button
                onClick={() => {
                  alert('Thank you! Your feedback has been recorded.');
                  setFeedbackOrderId(null);
                }}
                style={{ ...styles.checkoutSubmitBtn, marginTop: '1rem' }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

        {/* QUICK USER / STUDENT SWITCH MODAL */}
        {showAuthModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <User size={36} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.35rem' }}>Select User Profile</h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Simulate different student & staff experiences
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    login('student', 'krithik.student@campusbite.com');
                    setShowAuthModal(false);
                  }}
                  style={{
                    ...styles.profileSelectBtn,
                    border: user?.email?.includes('krithik') ? '2px solid var(--accent-primary)' : '1px solid #334155'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Krithik (Student - 23CCE302)</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Student Customer • 120 Rewards Points</div>
                </button>

                <button
                  onClick={() => {
                    login('student', 'gokul.student@campusbite.com');
                    setShowAuthModal(false);
                  }}
                  style={{
                    ...styles.profileSelectBtn,
                    border: user?.email?.includes('gokul') ? '2px solid var(--accent-primary)' : '1px solid #334155'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Gokul (Student - 23CCE305)</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Student Customer • 240 Rewards Points</div>
                </button>

                <button
                  onClick={() => {
                    login('guest', 'guest@campusbite.com');
                    setShowAuthModal(false);
                  }}
                  style={{
                    ...styles.profileSelectBtn,
                    border: isGuest ? '2px solid var(--accent-primary)' : '1px solid #334155'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Guest Student Mode</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Browse menu & place walk-in orders</div>
                </button>

                <button
                  onClick={() => {
                    login('manager', 'varun.manager@campusbite.com');
                    setShowAuthModal(false);
                    navigate('/cashier');
                  }}
                  style={{ ...styles.profileSelectBtn, backgroundColor: '#0f172a' }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#38bdf8' }}>
                    Varun (Admin / Store Manager)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Full Staff Portal Access</div>
                </button>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                style={styles.modalCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Bottom Mobile Navigation Bar */}
        <div style={styles.bottomNavBar}>
          <button
            onClick={() => setActiveTab('home')}
            style={{ ...styles.navTabBtn, color: activeTab === 'home' ? 'var(--accent-primary)' : '#64748b' }}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            style={{ ...styles.navTabBtn, color: activeTab === 'menu' ? 'var(--accent-primary)' : '#64748b' }}
          >
            <UtensilsCrossed size={20} />
            <span>Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            style={{ ...styles.navTabBtn, color: activeTab === 'cart' ? 'var(--accent-primary)' : '#64748b' }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span style={styles.cartBadge}>{cart.length}</span>}
            </div>
            <span>Cart</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{ ...styles.navTabBtn, color: activeTab === 'orders' ? 'var(--accent-primary)' : '#64748b' }}
          >
            <Clock size={20} />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{ ...styles.navTabBtn, color: activeTab === 'profile' ? 'var(--accent-primary)' : '#64748b' }}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  mobileContainer: {
    minHeight: '100vh',
    height: '100dvh',
    width: '100%',
    backgroundColor: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0,
    margin: 0
  },
  mobileFrame: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0f172a'
  },
  outerContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 50% 15%, #1e1b4b 0%, #090d16 75%)',
    padding: '1.25rem 1rem'
  },
  phoneFrame: {
    width: '100%',
    maxWidth: '425px',
    height: '870px',
    maxHeight: '94vh',
    backgroundColor: '#0f172a',
    borderRadius: '46px',
    border: '9px solid #1e293b',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  simulatorToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '430px',
    marginBottom: '0.75rem',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  simBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    border: '1px solid #334155',
    color: '#cbd5e1'
  },
  simPulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981'
  },
  toolbarBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 40,
    pointerEvents: 'none'
  },
  dynamicIslandPill: {
    width: '110px',
    height: '24px',
    backgroundColor: '#000',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '12px',
    gap: '6px'
  },
  cameraLens: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    border: '1.5px solid #1e293b'
  },
  sensorDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#1e293b'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem 0.25rem 1.5rem',
    color: '#94a3b8'
  },
  timeText: {
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center'
  },
  batteryContainer: {
    width: '20px',
    height: '10px',
    borderRadius: '3px',
    border: '1.5px solid #94a3b8',
    padding: '1px',
    marginLeft: '6px',
    display: 'flex',
    alignItems: 'center'
  },
  batteryFill: {
    width: '80%',
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: '1px'
  },
  profileSelectBtn: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    border: '1px solid #334155'
  },
  modalCloseBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    borderRadius: '8px',
    padding: '0.65rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '0.75rem',
    width: '100%'
  },
  switchUserFullBtn: {
    width: '100%',
    marginTop: '1rem',
    backgroundColor: '#334155',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  guestBanner: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderBottom: '1px solid rgba(249, 115, 22, 0.3)',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#cbd5e1'
  },
  signInSmallBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 1.25rem'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  greetingTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: 0
  },
  greetingSubtitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: 0
  },
  pointsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: '#1e293b',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  activeOrderBanner: {
    marginTop: '1rem',
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    borderRadius: '16px',
    padding: '1rem',
    color: '#fff',
    cursor: 'pointer'
  },
  tokenPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: '800',
    fontSize: '0.85rem'
  },
  activeStatusPill: {
    backgroundColor: '#fff',
    color: '#ea580c',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.75rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    margin: 0
  },
  seeAll: {
    fontSize: '0.75rem',
    color: 'var(--accent-primary)',
    cursor: 'pointer',
    fontWeight: '600'
  },
  specialsCarousel: {
    display: 'flex',
    gap: '0.75rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
  },
  specialCard: {
    width: '200px',
    flexShrink: 0,
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #334155'
  },
  specialImage: {
    width: '100%',
    height: '110px',
    objectFit: 'cover'
  },
  specialCardBody: {
    padding: '0.75rem'
  },
  specialPrice: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--accent-primary)'
  },
  specialName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    margin: '0.4rem 0 0.6rem 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  quickAddBtn: {
    width: '100%',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.4rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    marginTop: '0.75rem'
  },
  categoryChipCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '0.75rem 0.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    border: '1px solid #334155'
  },
  categoryChipLabel: {
    fontSize: '0.7rem',
    color: '#cbd5e1',
    fontWeight: '600',
    textAlign: 'center'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: '0.6rem 0.85rem',
    borderRadius: '12px',
    gap: '0.5rem',
    border: '1px solid #334155'
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.85rem'
  },
  pillsScroll: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    margin: '0.75rem 0',
    paddingBottom: '4px'
  },
  pillBtn: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer'
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  vegToggleBtn: {
    border: '1px solid #10b981',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  menuItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  dishCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '0.75rem',
    display: 'flex',
    gap: '0.75rem',
    border: '1px solid #334155'
  },
  dishImage: {
    width: '80px',
    height: '80px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  dishInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  vegPill: {
    fontSize: '0.65rem',
    color: '#10b981',
    fontWeight: '800'
  },
  nonVegPill: {
    fontSize: '0.65rem',
    color: '#ef4444',
    fontWeight: '800'
  },
  dishCategoryPill: {
    fontSize: '0.65rem',
    backgroundColor: '#334155',
    color: '#94a3b8',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  dishName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    margin: '2px 0'
  },
  prepTimeText: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  dishBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px'
  },
  dishPrice: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--accent-primary)'
  },
  dishAddBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  screenHeading: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  emptyCartBox: {
    textAlign: 'center',
    padding: '4rem 1rem'
  },
  browseMenuBtn: {
    marginTop: '1.25rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.65rem 1.5rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  cartItemRow: {
    backgroundColor: '#1e293b',
    padding: '0.75rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  cartItemTitle: {
    fontSize: '0.85rem',
    margin: 0
  },
  cartItemUnitPrice: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#0f172a',
    padding: '2px 6px',
    borderRadius: '6px'
  },
  qtyBtn: {
    background: 'transparent',
    color: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    padding: '2px'
  },
  qtyNum: {
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  cartItemTotal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    minWidth: '50px',
    textAlign: 'right'
  },
  couponCard: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem'
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '0.6rem 0.8rem',
    color: '#fff',
    fontSize: '0.8rem',
    outline: 'none'
  },
  couponApplyBtn: {
    backgroundColor: '#334155',
    color: 'var(--accent-primary)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.8rem'
  },
  instructionsInput: {
    width: '100%',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '0.6rem 0.8rem',
    color: '#fff',
    fontSize: '0.8rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  subHeading: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginTop: '1rem',
    marginBottom: '0.5rem'
  },
  paymentMethodRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
    marginBottom: '1rem'
  },
  paymentOptionCard: {
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1.5px solid',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    cursor: 'pointer'
  },
  paymentOptionTitle: {
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  paymentOptionSubtitle: {
    fontSize: '0.65rem',
    color: '#94a3b8'
  },
  billSummaryCard: {
    backgroundColor: '#1e293b',
    padding: '0.85rem',
    borderRadius: '12px',
    marginTop: '0.75rem'
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '0.4rem',
    color: '#94a3b8'
  },
  billDivider: {
    height: '1px',
    backgroundColor: '#334155',
    margin: '0.4rem 0'
  },
  billTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    fontWeight: '700'
  },
  checkoutSubmitBtn: {
    width: '100%',
    marginTop: '1rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.85rem',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.95rem'
  },
  trackingCard: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1.5px solid #334155'
  },
  tokenLargeBadge: {
    fontSize: '1.6rem',
    fontWeight: '900',
    color: 'var(--accent-primary)'
  },
  stepperContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5rem 0'
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepDot: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#fff'
  },
  orderItemsSnippet: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    margin: '0.75rem 0'
  },
  snippetChip: {
    backgroundColor: '#0f172a',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: '#cbd5e1'
  },
  advanceSimBtn: {
    width: '100%',
    marginTop: '0.75rem',
    backgroundColor: '#334155',
    color: '#38bdf8',
    padding: '0.55rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem'
  },
  pastOrderCard: {
    backgroundColor: '#1e293b',
    padding: '0.75rem',
    borderRadius: '10px',
    marginBottom: '0.6rem',
    border: '1px solid #334155'
  },
  reorderSmallBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  profileHeader: {
    textAlign: 'center',
    padding: '1.5rem 0'
  },
  profileAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontSize: '1.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  pointsCard: {
    background: 'linear-gradient(135deg, #b45309, #f59e0b)',
    borderRadius: '16px',
    padding: '1.25rem',
    color: '#fff',
    marginBottom: '1.5rem'
  },
  profileOptionsList: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #334155'
  },
  profileOptionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.85rem 1rem',
    borderBottom: '1px solid #334155',
    fontSize: '0.85rem'
  },
  logoutFullBtn: {
    width: '100%',
    marginTop: '1.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '0.75rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 100
  },
  modalCard: {
    backgroundColor: '#1e293b',
    borderRadius: '20px',
    padding: '1.5rem',
    width: '100%',
    border: '1px solid #334155'
  },
  modalSummaryBox: {
    backgroundColor: '#0f172a',
    padding: '0.75rem',
    borderRadius: '10px'
  },
  paymentFailedAlert: {
    marginTop: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    padding: '0.5rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    textAlign: 'center'
  },
  paySuccessBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  payFailBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  bottomNavBar: {
    height: '62px',
    backgroundColor: '#1e293b',
    borderTop: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navTabBtn: {
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    fontSize: '0.65rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-8px',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '0.6rem',
    fontWeight: '800',
    padding: '1px 5px'
  }
};
