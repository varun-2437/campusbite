class RazorpayResult {
  final bool isSuccess;
  final String? paymentId;
  final String? orderId;
  final String? signature;
  final String? errorMessage;

  RazorpayResult.success({
    required this.paymentId,
    required this.orderId,
    this.signature,
  })  : isSuccess = true,
        errorMessage = null;

  RazorpayResult.failure(this.errorMessage)
      : isSuccess = false,
        paymentId = null,
        orderId = null,
        signature = null;
}

class RazorpayService {
  static final RazorpayService _instance = RazorpayService._internal();
  factory RazorpayService() => _instance;
  RazorpayService._internal();

  /// Mock Razorpay checkout runner with simulated gateway options
  Future<RazorpayResult> openCheckout({
    required double amount,
    required String orderId,
    required String userEmail,
    required String userName,
    String? contact,
  }) async {
    // Simulate payment gateway presentation
    await Future.delayed(const Duration(milliseconds: 1200));

    // Generates simulated successful Razorpay Payment ID
    final payId = 'pay_${DateTime.now().millisecondsSinceEpoch.toRadixString(36).toUpperCase()}';
    return RazorpayResult.success(
      paymentId: payId,
      orderId: orderId,
      signature: 'sig_${DateTime.now().microsecondsSinceEpoch}',
    );
  }
}
