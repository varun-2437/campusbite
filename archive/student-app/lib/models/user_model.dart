class UserModel {
  final String userId;
  final String name;
  final String email;
  final String? studentId;
  final int loyaltyPoints;
  final String role;
  final bool isGuest;
  final String? guestSessionId;

  UserModel({
    required this.userId,
    required this.name,
    required this.email,
    this.studentId,
    this.loyaltyPoints = 0,
    this.role = 'student',
    this.isGuest = false,
    this.guestSessionId,
  });

  UserModel copyWith({
    String? userId,
    String? name,
    String? email,
    String? studentId,
    int? loyaltyPoints,
    String? role,
    bool? isGuest,
    String? guestSessionId,
  }) {
    return UserModel(
      userId: userId ?? this.userId,
      name: name ?? this.name,
      email: email ?? this.email,
      studentId: studentId ?? this.studentId,
      loyaltyPoints: loyaltyPoints ?? this.loyaltyPoints,
      role: role ?? this.role,
      isGuest: isGuest ?? this.isGuest,
      guestSessionId: guestSessionId ?? this.guestSessionId,
    );
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      studentId: json['studentId'],
      loyaltyPoints: json['loyaltyPoints'] ?? 0,
      role: json['role'] ?? 'student',
      isGuest: json['isGuest'] ?? false,
      guestSessionId: json['guestSessionId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'email': email,
      'studentId': studentId,
      'loyaltyPoints': loyaltyPoints,
      'role': role,
      'isGuest': isGuest,
      'guestSessionId': guestSessionId,
    };
  }

  factory UserModel.guest() {
    final now = DateTime.now().millisecondsSinceEpoch;
    return UserModel(
      userId: 'guest_$now',
      name: 'Guest Diner',
      email: 'guest_$now@campusbite.local',
      role: 'guest',
      isGuest: true,
      guestSessionId: 'GS-$now',
    );
  }
}
