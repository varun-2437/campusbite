class CouponModel {
  final String code;
  final String title;
  final String description;
  final double discountValue; // flat amount or percentage
  final bool isPercentage;
  final double minOrderAmount;
  final DateTime expiryDate;
  final int pointsCost; // for loyalty store redemption
  final bool isRedeemed;

  const CouponModel({
    required this.code,
    required this.title,
    required this.description,
    required this.discountValue,
    this.isPercentage = false,
    this.minOrderAmount = 0.0,
    required this.expiryDate,
    this.pointsCost = 0,
    this.isRedeemed = false,
  });

  double calculateDiscount(double subtotal) {
    if (subtotal < minOrderAmount) return 0.0;
    if (isPercentage) {
      return (subtotal * (discountValue / 100)).clamp(0, subtotal);
    }
    return discountValue.clamp(0, subtotal);
  }

  CouponModel copyWith({
    String? code,
    String? title,
    String? description,
    double? discountValue,
    bool? isPercentage,
    double? minOrderAmount,
    DateTime? expiryDate,
    int? pointsCost,
    bool? isRedeemed,
  }) {
    return CouponModel(
      code: code ?? this.code,
      title: title ?? this.title,
      description: description ?? this.description,
      discountValue: discountValue ?? this.discountValue,
      isPercentage: isPercentage ?? this.isPercentage,
      minOrderAmount: minOrderAmount ?? this.minOrderAmount,
      expiryDate: expiryDate ?? this.expiryDate,
      pointsCost: pointsCost ?? this.pointsCost,
      isRedeemed: isRedeemed ?? this.isRedeemed,
    );
  }
}
