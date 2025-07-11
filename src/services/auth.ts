import api from '@/lib/api';
import Cookies from 'js-cookie';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { user, token } = response.data;
    
    // Salvar token nos cookies
    Cookies.set('token', token, { expires: 7 }); // 7 dias
    
    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    
    // Salvar token nos cookies
    Cookies.set('token', token, { expires: 7 }); // 7 dias
    
    return { user, token };
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorar erros de logout
    } finally {
      Cookies.remove('token');
    }
  }

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.user;
  }

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    
    Cookies.set('token', token, { expires: 7 });
    
    return token;
  }

  getToken(): string | undefined {
    return Cookies.get('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();

