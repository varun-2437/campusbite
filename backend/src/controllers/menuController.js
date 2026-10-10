import { MenuItem } from '../models/MenuItem.js';

export const getMenu = async (req, res) => {
  try {
    const { category, veg, available } = req.query;
    const filter = { isDeleted: false };

    if (category) filter.category = category;
    if (veg !== undefined) filter.isVeg = veg === 'true';
    if (available !== undefined) filter.isAvailable = available === 'true';

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menu', error: err.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, category, prepTime, isVeg, imageUrl, isAvailable } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const itemId = `m${Date.now().toString().slice(-4)}`;
    const newItem = await MenuItem.create({
      itemId,
      name,
      price: Number(price),
      category: category || 'Food',
      prepTime: Number(prepTime) || 10,
      isVeg: isVeg !== undefined ? isVeg : true,
      imageUrl: imageUrl || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    res.status(201).json({ message: 'Menu item created', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error creating menu item', error: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await MenuItem.findOneAndUpdate(
      { $or: [{ itemId: id }, { _id: id }] },
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating menu item', error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Perform soft-delete so active order references are preserved
    const item = await MenuItem.findOneAndUpdate(
      { $or: [{ itemId: id }, { _id: id }] },
      { isDeleted: true, isAvailable: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item soft-deleted successfully', id: item.itemId });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting menu item', error: err.message });
  }
};
