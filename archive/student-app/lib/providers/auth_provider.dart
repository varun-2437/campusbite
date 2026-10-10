import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isGuest => _user?.isGuest ?? false;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _apiService.login(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String studentId,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _apiService.register(
        name: name,
        studentId: studentId,
        email: email,
        password: password,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> continueAsGuest() async {
    _isLoading = true;
    notifyListeners();
    _user = await _apiService.startGuestSession();
    _isLoading = false;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _errorMessage = null;
    notifyListeners();
  }

  void updateProfile({String? name, String? email}) {
    if (_user != null) {
      _user = _user!.copyWith(
        name: name ?? _user!.name,
        email: email ?? _user!.email,
      );
      notifyListeners();
    }
  }

  void addLoyaltyPoints(int points) {
    if (_user != null && !_user!.isGuest) {
      _user = _user!.copyWith(loyaltyPoints: _user!.loyaltyPoints + points);
      notifyListeners();
    }
  }

  bool redeemLoyaltyPoints(int points) {
    if (_user != null && !_user!.isGuest && _user!.loyaltyPoints >= points) {
      _user = _user!.copyWith(loyaltyPoints: _user!.loyaltyPoints - points);
      notifyListeners();
      return true;
    }
    return false;
  }
}
