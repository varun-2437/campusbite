import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class QrCodeWidget extends StatelessWidget {
  final String qrData;
  final String tokenId;
  final double size;

  const QrCodeWidget({
    super.key,
    required this.qrData,
    required this.tokenId,
    this.size = 180.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // QR Code Box
        Container(
          width: size,
          height: size,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: CustomPaint(
            painter: _DigitalQrPainter(data: qrData),
          ),
        ),
        const SizedBox(height: 12),

        // Token Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.12),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.primary.withOpacity(0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.qr_code_scanner_rounded, size: 16, color: AppColors.primary),
              const SizedBox(width: 6),
              Text(
                'TOKEN: $tokenId',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DigitalQrPainter extends CustomPainter {
  final String data;

  _DigitalQrPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;

    const int matrixSize = 21;
    final double cellSize = size.width / matrixSize;

    // Deterministic pseudo-random seed based on data string hash
    final seed = data.codeUnits.fold(0, (acc, c) => acc + c);
    final random = Random(seed);

    for (int r = 0; r < matrixSize; r++) {
      for (int c = 0; c < matrixSize; c++) {
        // Draw 3 Corner Position Detection Patterns
        final inTopLeft = (r < 7 && c < 7);
        final inTopRight = (r < 7 && c >= matrixSize - 7);
        final inBottomLeft = (r >= matrixSize - 7 && c < 7);

        if (inTopLeft || inTopRight || inBottomLeft) {
          final relR = inBottomLeft ? r - (matrixSize - 7) : r;
          final relC = inTopRight ? c - (matrixSize - 7) : c;

          if (relR == 0 || relR == 6 || relC == 0 || relC == 6) {
            canvas.drawRect(Rect.fromLTWH(c * cellSize, r * cellSize, cellSize, cellSize), paint);
          } else if (relR >= 2 && relR <= 4 && relC >= 2 && relC <= 4) {
            canvas.drawRect(Rect.fromLTWH(c * cellSize, r * cellSize, cellSize, cellSize), paint);
          }
        } else {
          // Inner grid data cells
          if (random.nextBool()) {
            canvas.drawRRect(
              RRect.fromRectAndRadius(
                Rect.fromLTWH(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1),
                const Radius.circular(1.5),
              ),
              paint,
            );
          }
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant _DigitalQrPainter oldDelegate) => oldDelegate.data != data;
}
