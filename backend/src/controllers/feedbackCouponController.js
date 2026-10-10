import { Feedback, Coupon } from '../models/FeedbackCoupon.js';

export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving feedback', error: err.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { orderId, rating, comment, studentName } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({ message: 'OrderId and rating are required' });
    }

    const fb = await Feedback.create({
      orderId,
      rating: Number(rating),
      comment: comment || '',
      studentName: studentName || 'Student'
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: fb });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback', error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount = 0 } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (cartAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Coupon requires minimum order of ₹${coupon.minOrderAmount}`
      });
    }

    const discount = coupon.discountType === 'percentage'
      ? Math.round((cartAmount * coupon.discountValue) / 100)
      : coupon.discountValue;

    res.json({
      valid: true,
      code: coupon.code,
      discountAmount: discount,
      message: `Coupon applied: ₹${discount} off`
    });
  } catch (err) {
    res.status(500).json({ message: 'Error validating coupon', error: err.message });
  }
};
