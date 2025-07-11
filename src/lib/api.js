import axios from 'axios';
import Cookies from 'js-cookie';
// Configuração base da API
const api = axios.create({
    baseURL:  'https://jackbear-sms.r954jc.easypanel.host/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Interceptor para tratar respostas e erros
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // Token expirado ou inválido
        Cookies.remove('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export default api;
