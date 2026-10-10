import 'cart_item.dart';

enum OrderStatus {
  pending,
  preparing,
  ready,
  collected,
  cancelled;

  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Confirmed';
      case OrderStatus.preparing:
        return 'Preparing';
      case OrderStatus.ready:
        return 'Ready for Pickup';
      case OrderStatus.collected:
        return 'Collected';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  static OrderStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'confirmed':
        return OrderStatus.pending;
      case 'preparing':
        return OrderStatus.preparing;
      case 'ready':
        return OrderStatus.ready;
      case 'collected':
      case 'completed':
        return OrderStatus.collected;
      case 'cancelled':
        return OrderStatus.cancelled;
      default:
        return OrderStatus.pending;
    }
  }
}

class OrderModel {
  final String orderId;
  final String? studentId;
  final String? guestSessionId;
  final List<CartItem> items;
  final OrderStatus status;
  final DateTime createdAt;
  final double subtotal;
  final double discount;
  final double totalAmount;
  final String paymentMethod; // 'Online' or 'Cash'
  final String paymentStatus; // 'Pending' or 'Paid'
  final String tokenId;
  final String qrCode;
  final int estimatedReadyMinutes;
  final bool isReviewed;
  final double? rating;
  final String? reviewComment;

  OrderModel({
    required this.orderId,
    this.studentId,
    this.guestSessionId,
    required this.items,
    required this.status,
    required this.createdAt,
    required this.subtotal,
    this.discount = 0.0,
    required this.totalAmount,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.tokenId,
    required this.qrCode,
    this.estimatedReadyMinutes = 15,
    this.isReviewed = false,
    this.rating,
    this.reviewComment,
  });

  OrderModel copyWith({
    String? orderId,
    String? studentId,
    String? guestSessionId,
    List<CartItem>? items,
    OrderStatus? status,
    DateTime? createdAt,
    double? subtotal,
    double? discount,
    double? totalAmount,
    String? paymentMethod,
    String? paymentStatus,
    String? tokenId,
    String? qrCode,
    int? estimatedReadyMinutes,
    bool? isReviewed,
    double? rating,
    String? reviewComment,
  }) {
    return OrderModel(
      orderId: orderId ?? this.orderId,
      studentId: studentId ?? this.studentId,
      guestSessionId: guestSessionId ?? this.guestSessionId,
      items: items ?? this.items,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      subtotal: subtotal ?? this.subtotal,
      discount: discount ?? this.discount,
      totalAmount: totalAmount ?? this.totalAmount,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      tokenId: tokenId ?? this.tokenId,
      qrCode: qrCode ?? this.qrCode,
      estimatedReadyMinutes: estimatedReadyMinutes ?? this.estimatedReadyMinutes,
      isReviewed: isReviewed ?? this.isReviewed,
      rating: rating ?? this.rating,
      reviewComment: reviewComment ?? this.reviewComment,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'studentId': studentId,
      'guestSessionId': guestSessionId,
      'items': items.map((i) => i.toJson()).toList(),
      'status': status.name,
      'createdAt': createdAt.toIso8601String(),
      'subtotal': subtotal,
      'discount': discount,
      'totalAmount': totalAmount,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentStatus,
      'tokenId': tokenId,
      'qrCode': qrCode,
      'estimatedReadyMinutes': estimatedReadyMinutes,
      'isReviewed': isReviewed,
      'rating': rating,
      'reviewComment': reviewComment,
    };
  }
}
