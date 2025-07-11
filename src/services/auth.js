// --- START OF FILE services/auth.js ---

import api from '@/lib/api';
import Cookies from 'js-cookie';

class AuthService {
    /**
     * Realiza o login do usuário.
     * @param {object} data - Contém email e password.
     * @returns {Promise<{user: object, token: string}>}
     */
    async login(data) {
        // Nenhuma alteração necessária aqui, já estava correto.
        const response = await api.post('/auth/login', data);
        const { user, token } = response.data.data; // A resposta do backend está em 'response.data.data'
        
        // Salvar token nos cookies
        Cookies.set('token', token, { expires: 7 }); // 7 dias
        return { user, token };
    }

    /**
     * Registra um novo usuário.
     * @param {object} data - Contém name, email e password.
     * @returns {Promise<{user: object, token: string}>}
     */
    async register(data) {
        // CORRIGIDO: O backend espera 'username', mas o formulário envia 'name'.
        // Mapeamos 'name' para 'username' antes de enviar para a API.
        const apiData = {
            username: data.name,
            email: data.email,
            password: data.password
        };

        const response = await api.post('/auth/register', apiData);
        const { user, token } = response.data.data; // A resposta do backend está em 'response.data.data'
        
        // Salvar token nos cookies para fazer o "auto-login" após o cadastro.
        Cookies.set('token', token, { expires: 7 }); // 7 dias
        return { user, token };
    }

    /**
     * Realiza o logout do usuário.
     */
    async logout() {
        try {
            // A chamada para o backend é opcional em um sistema JWT, mas mantemos por consistência.
            await api.post('/auth/logout');
        } catch (error) {
            // Ignorar erros de logout, o importante é limpar o cookie local.
        } finally {
            Cookies.remove('token');
        }
    }

    /**
     * Obtém o perfil do usuário autenticado.
     * @returns {Promise<object>}
     */
    async getProfile() {
        // CORRIGIDO: O endpoint no backend é '/auth/me' e não '/auth/profile'.
        const response = await api.get('/auth/me');
        // CORRIGIDO: A resposta do backend com os dados do usuário está em 'response.data.data'.
        return response.data.data;
    }

    /**
     * REMOVIDO: A função refreshToken() foi removida pois não existe um endpoint
     * correspondente no backend ('/auth/refresh' não existe).
     */

    /**
     * Obtém o token do cookie.
     * @returns {string | undefined}
     */
    getToken() {
        return Cookies.get('token');
    }

    /**
     * Verifica se o usuário está autenticado baseado na existência do token.
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService();

// --- END OF FILE services/auth.js ---