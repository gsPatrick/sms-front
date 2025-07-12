import api from '@/lib/api';
import Cookies from 'js-cookie';

class AuthService {
    async login(data) {
        const response = await api.post('/auth/login', data);
        const { user, token } = response.data.data;
        Cookies.set('token', token, { expires: 7 });
        return { user, token };
    }

    async register(data) {
        const apiData = {
            username: data.name,
            email: data.email,
            password: data.password
        };
        const response = await api.post('/auth/register', apiData);
        const { user, token } = response.data.data;
        Cookies.set('token', token, { expires: 7 });
        return { user, token };
    }

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignorar erros
        } finally {
            Cookies.remove('token');
        }
    }

    async getProfile() {
        const response = await api.get('/auth/me');
        return response.data.data;
    }

    getToken() {
        return Cookies.get('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

// CORREÇÃO FINAL: Criando a instância antes de exportar
const authService = new AuthService();
export default authService;