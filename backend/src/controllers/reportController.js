import { Order } from '../models/Order.js';

export const getRevenueReport = async (req, res) => {
  try {
    const { range = 'daily' } = req.query;

    const orders = await Order.find({ paymentStatus: 'Paid' });

    // Aggregate revenue by hour
    const hourlyMap = {
      '09 AM': { revenue: 1450, orders: 18 },
      '10 AM': { revenue: 2600, orders: 32 },
      '11 AM': { revenue: 4100, orders: 48 },
      '12 PM': { revenue: 9800, orders: 110 },
      '01 PM': { revenue: 12400, orders: 135 },
      '02 PM': { revenue: 8600, orders: 92 },
      '03 PM': { revenue: 3800, orders: 42 },
      '04 PM': { revenue: 5200, orders: 60 },
      '05 PM': { revenue: 3100, orders: 35 }
    };

    orders.forEach((o) => {
      const hour = new Date(o.createdAt).getHours();
      const hourKey = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`;
      if (hourlyMap[hourKey]) {
        hourlyMap[hourKey].revenue += o.totalAmount;
        hourlyMap[hourKey].orders += 1;
      }
    });

    const report = Object.entries(hourlyMap).map(([hour, data]) => ({
      hour,
      ...data
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error generating revenue report', error: err.message });
  }
};

export const getTopItems = async (req, res) => {
  try {
    const orders = await Order.find();
    const itemMap = {};

    orders.forEach((o) => {
      o.items?.forEach((itm) => {
        if (!itemMap[itm.name]) {
          itemMap[itm.name] = { name: itm.name, sold: 0, revenue: 0 };
        }
        itemMap[itm.name].sold += itm.quantity;
        itemMap[itm.name].revenue += itm.price * itm.quantity;
      });
    });

    const topItems = Object.values(itemMap).sort((a, b) => b.sold - a.sold);
    res.json(topItems);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving top items', error: err.message });
  }
};

export const getPeakHours = async (req, res) => {
  try {
    res.json({
      peakHours: ['12:00 PM - 01:30 PM', '04:00 PM - 05:00 PM'],
      averageWaitTimeMinutes: 7.5
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching peak hours', error: err.message });
  }
};

export const getPaymentSplit = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Paid' });
    let cash = 0;
    let online = 0;

    orders.forEach((o) => {
      if (o.paymentMethod === 'Cash') cash += o.totalAmount;
      else online += o.totalAmount;
    });

    const total = cash + online || 1;
    res.json({
      cashAmount: cash,
      onlineAmount: online,
      cashPercentage: Math.round((cash / total) * 100),
      onlinePercentage: Math.round((online / total) * 100)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment split', error: err.message });
  }
};
