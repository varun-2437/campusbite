import React, { useState } from 'react';
import { X, Plus, Minus, Check, Clock } from 'lucide-react';
import { Field } from '../../theme/ui';

export default function ItemCustomizationModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cookingInstructions, setCookingInstructions] = useState('');

  const getAvailableAddOns = () => {
    const cat = item.category?.toLowerCase() || '';
    if (cat.includes('drink') || cat.includes('beverage') || cat.includes('coffee')) {
      return [
        { id: 'ao-ice', name: 'Extra Crushed Ice', price: 0 },
        { id: 'ao-sugar', name: 'Less Sugar', price: 0 },
        { id: 'ao-choc', name: 'Whipped Cream & Chocolate Drizzle', price: 20 },
        { id: 'ao-shot', name: 'Double Espresso Shot', price: 25 }
      ];
    }
    if (cat.includes('ice cream') || cat.includes('dessert') || cat.includes('chocolate')) {
      return [
        { id: 'ao-fudge', name: 'Hot Chocolate Fudge Topping', price: 25 },
        { id: 'ao-nuts', name: 'Roasted Almonds & Cashews', price: 20 },
        { id: 'ao-sprinkles', name: 'Waffle Crunch Topping', price: 15 }
      ];
    }
    return [
      { id: 'ao-cheese', name: 'Extra Melted Cheese Slice', price: 20 },
      { id: 'ao-spicy', name: 'Spicy Schezwan Toss', price: 15 },
      { id: 'ao-mayo', name: 'Garlic Mayo Dip', price: 15 },
      { id: 'ao-salad', name: 'Extra Fresh Onion & Lemon', price: 10 }
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
    onAddToCart(
      item,
      {
        addOns: selectedAddOns,
        instructions: cookingInstructions
      },
      quantity
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[480px] bg-surface border border-line rounded-xl shadow-pop overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <h2 className="text-[16px] font-semibold text-fg">
              Customize Item
            </h2>
            <p className="text-[12px] text-fg-muted mt-0.5">
              {item.name}
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

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Item Summary Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  item.isVeg ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                }`}
              >
                {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
              <span className="text-[12px] text-fg-muted flex items-center gap-1">
                <Clock size={12} strokeWidth={1.75} />
                <span>{item.prepTime || 8} min prep</span>
              </span>
            </div>
            <span className="text-[16px] font-semibold text-fg tabular-nums">
              ₹{item.price}
            </span>
          </div>

          {/* Add-ons List */}
          <div className="space-y-2">
            <label className="label">
              Add-ons & Extras
            </label>
            <div className="space-y-1.5">
              {addOns.map((addon) => {
                const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer select-none transition-colors duration-150 ${
                      isSelected
                        ? 'border-accent bg-accent-soft text-accent'
                        : 'border-line bg-surface hover:bg-surface-2 text-fg'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'border-accent bg-accent text-accent-fg' : 'border-line-strong'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={2.5} />}
                      </div>
                      <span className="text-[13px] font-medium">{addon.name}</span>
                    </div>
                    <span className="text-[12.5px] font-medium tabular-nums text-fg-muted">
                      {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kitchen instructions field */}
          <div>
            <label htmlFor="custom-instructions" className="label">
              Special Kitchen Instructions (Optional)
            </label>
            <input
              id="custom-instructions"
              type="text"
              placeholder="e.g. Less spicy, dressing on side..."
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              className="input text-[14px]"
            />
          </div>

          {/* Quantity picker */}
          <div className="flex items-center justify-between pt-3 border-t border-line">
            <span className="text-[13px] font-medium text-fg">Quantity</span>
            <div className="flex items-center border border-line-strong rounded-md overflow-hidden bg-surface">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-fg hover:bg-surface-2 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={1.75} />
              </button>
              <span className="w-10 text-center text-[13px] font-semibold text-fg tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-fg hover:bg-surface-2 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-line bg-surface-2/40 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-fg-muted uppercase tracking-wider">Total</div>
            <div className="text-[16px] font-semibold text-fg tabular-nums">₹{totalPrice}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-primary btn-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
