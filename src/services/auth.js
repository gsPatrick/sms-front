import api from '@/lib/api';
import Cookies from 'js-cookie';
class AuthService {
    async login(data) {
        const response = await api.post('/auth/login', data);
        const { user, token } = response.data;
        // Salvar token nos cookies
        Cookies.set('token', token, { expires: 7 }); // 7 dias
        return { user, token };
    }
    async register(data) {
        const response = await api.post('/auth/register', data);
        const { user, token } = response.data;
        // Salvar token nos cookies
        Cookies.set('token', token, { expires: 7 }); // 7 dias
        return { user, token };
    }
    async logout() {
        try {
            await api.post('/auth/logout');
        }
        catch (error) {
            // Ignorar erros de logout
        }
        finally {
            Cookies.remove('token');
        }
    }
    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data.user;
    }
    async refreshToken() {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        Cookies.set('token', token, { expires: 7 });
        return token;
    }
    getToken() {
        return Cookies.get('token');
    }
    isAuthenticated() {
        return !!this.getToken();
    }
}
export default new AuthService();
