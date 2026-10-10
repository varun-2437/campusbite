import 'package:flutter/foundation.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isGuest = false;
  String _name = 'Krithik (Student)';
  String _email = 'krithik@campusbite.com';
  String _studentId = 'STU-1042';
  int _loyaltyPoints = 140;
  String? _token;

  bool get isAuthenticated => _isAuthenticated;
  bool get isGuest => _isGuest;
  String get name => _name;
  String get email => _email;
  String get studentId => _studentId;
  int get loyaltyPoints => _loyaltyPoints;
  String? get token => _token;

  void loginStudent({required String email, required String password}) {
    _isAuthenticated = true;
    _isGuest = false;
    _name = 'Krithik Student';
    _email = email;
    _studentId = 'STU-1042';
    _loyaltyPoints = 140;
    _token = 'jwt_student_mock_token';
    notifyListeners();
  }

  void continueAsGuest() {
    _isAuthenticated = true;
    _isGuest = true;
    _name = 'Guest User';
    _email = 'guest@campusbite.com';
    _studentId = '';
    _loyaltyPoints = 0;
    _token = 'jwt_guest_session_token';
    notifyListeners();
  }

  void registerStudent({
    required String name,
    required String email,
    required String password,
    required String studentId,
  }) {
    _isAuthenticated = true;
    _isGuest = false;
    _name = name;
    _email = email;
    _studentId = studentId;
    _loyaltyPoints = 50; // Welcome reward bonus
    _token = 'jwt_student_registered_token';
    notifyListeners();
  }

  void redeemPoints(int points) {
    if (_loyaltyPoints >= points) {
      _loyaltyPoints -= points;
      notifyListeners();
    }
  }

  void addPoints(int points) {
    _loyaltyPoints += points;
    notifyListeners();
  }

  void updateProfile({required String name, required String email}) {
    _name = name;
    _email = email;
    notifyListeners();
  }

  void logout() {
    _isAuthenticated = false;
    _isGuest = false;
    _token = null;
    notifyListeners();
  }
}
