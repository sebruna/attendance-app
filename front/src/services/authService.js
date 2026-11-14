import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/user/login', { email, password });
    if (response.data.token) {
      // Save token and user details to disk memory
      localStorage.setItem('attendance_token', response.data.token);
      localStorage.setItem('attendance_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('attendance_token');
    localStorage.removeItem('attendance_user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('attendance_user');
    return user ? JSON.parse(user) : null;
  }
};