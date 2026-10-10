import { Inventory } from '../models/Inventory.js';
import { MenuItem } from '../models/MenuItem.js';

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ itemName: 1 });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory', error: err.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, threshold, unit, itemName } = req.body;

    const item = await Inventory.findOneAndUpdate(
      { $or: [{ _id: id }, { id: id }, { itemName: id }] },
      { quantity: Number(quantity), threshold: Number(threshold), unit, itemName },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Auto-mark linked menu items unavailable if stock hits 0
    if (item.quantity <= 0) {
      await MenuItem.updateMany(
        { name: { $regex: item.itemName.split(' ')[0], $options: 'i' } },
        { isAvailable: false }
      );
    }

    // Emit low stock alert via WebSocket if quantity <= threshold
    if (item.quantity <= item.threshold && req.io) {
      req.io.emit('lowStockAlert', {
        itemName: item.itemName,
        quantity: item.quantity,
        threshold: item.threshold
      });
    }

    res.json({ message: 'Inventory stock updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory', error: err.message });
  }
};
