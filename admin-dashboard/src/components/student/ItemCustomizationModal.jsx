import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

export default function ItemCustomizationModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cookingInstructions, setCookingInstructions] = useState('');

  // Context-specific add-ons based on category
  const getAvailableAddOns = () => {
    const cat = item.category?.toLowerCase() || '';
    if (cat.includes('drink') || cat.includes('beverage') || cat.includes('coffee')) {
      return [
        { id: 'ao-ice', name: 'Extra Crushed Ice', price: 0 },
        { id: 'ao-sugar', name: 'Sugar Free / Less Sweet', price: 0 },
        { id: 'ao-choc', name: 'Whipped Cream & Chocolate Drizzle', price: 20 },
        { id: 'ao-shot', name: 'Double Espresso Shot', price: 25 }
      ];
    }
    if (cat.includes('ice cream') || cat.includes('dessert') || cat.includes('chocolate')) {
      return [
        { id: 'ao-fudge', name: 'Hot Chocolate Fudge Topping', price: 25 },
        { id: 'ao-nuts', name: 'Roasted Almonds & Cashews', price: 20 },
        { id: 'ao-sprinkles', name: 'Choco Sprinkles & Waffle Crunch', price: 15 }
      ];
    }
    return [
      { id: 'ao-cheese', name: 'Extra Melted Cheese Slice', price: 20 },
      { id: 'ao-spicy', name: 'Extra Spicy Schezwan Toss', price: 15 },
      { id: 'ao-mayo', name: 'Garlic Mayo Dip (50g)', price: 15 },
      { id: 'ao-salad', name: 'Extra Fresh Onion & Lemon Salad', price: 10 }
    ];
  };

  const addOns = getAvailableAddOns();

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singleUnitPrice = item.price + addOnsTotal;
  const totalPrice = singleUnitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, {
      addOns: selectedAddOns,
      instructions: cookingInstructions
    }, quantity);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header Image & Close */}
        <div style={styles.imageContainer}>
          <img src={item.imageUrl} alt={item.name} style={styles.image} />
          <button onClick={onClose} style={styles.closeBtn} title="Close">
            <X size={18} />
          </button>
          <div style={styles.badgeOverlay}>
            <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
            <span style={styles.categoryBadge}>{item.category}</span>
          </div>
        </div>

        {/* Details Section */}
        <div style={styles.content}>
          <div style={styles.titleRow}>
            <div>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.prepTime}>⏱️ Approx {item.prepTime || 8} mins prep time</p>
            </div>
            <div style={styles.itemPrice}>₹{item.price}</div>
          </div>

          {/* Add-ons List */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={styles.sectionTitle}>Customize & Add Extras</span>
            </div>
            <div style={styles.addOnList}>
              {addOns.map((addon) => {
                const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    style={{
                      ...styles.addOnItem,
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={styles.checkbox}>
                      {isSelected && <Check size={14} color="var(--accent-primary)" />}
                    </div>
                    <span style={styles.addOnName}>{addon.name}</span>
                    <span style={styles.addOnPrice}>
                      {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions Input */}
          <div style={styles.section}>
            <label style={styles.label}>Special Cooking Request / Notes for Kitchen</label>
            <input
              type="text"
              placeholder="e.g. Less spicy, keep sauce separate, extra hot..."
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              style={styles.instructionInput}
            />
          </div>

          {/* Quantity and Total Action Bar */}
          <div style={styles.footer}>
            <div style={styles.quantityPicker}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyBtn}
              >
                <Minus size={14} />
              </button>
              <span style={styles.qtyText}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={styles.qtyBtn}
              >
                <Plus size={14} />
              </button>
            </div>

            <button onClick={handleConfirm} style={styles.addBtn}>
              <span>Add to Cart</span>
              <span style={styles.addBtnTotal}>₹{totalPrice}</span>
            </button>
          </div>
        </div>
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
    zIndex: 1200,
    padding: '1rem',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '460px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative'
  },
  imageContainer: {
    position: 'relative',
    height: '180px',
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  categoryBadge: {
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: '600'
  },
  content: {
    padding: '1.25rem'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem'
  },
  itemName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  prepTime: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  itemPrice: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--accent-primary)'
  },
  section: {
    marginBottom: '1.25rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '0.6rem'
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  addOnList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  addOnItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '1.5px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  addOnName: {
    flex: 1,
    fontSize: '0.85rem',
    color: 'var(--text-primary)'
  },
  addOnPrice: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--accent-secondary)'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px'
  },
  instructionInput: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-color)'
  },
  quantityPicker: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '4px'
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  qtyText: {
    padding: '0 0.6rem',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: 'var(--text-primary)'
  },
  addBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.92rem',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
    cursor: 'pointer'
  },
  addBtnTotal: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.85rem'
  }
};
