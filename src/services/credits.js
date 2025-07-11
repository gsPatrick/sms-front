import api from '@/lib/api';

class CreditsService {
    /**
     * Busca os pacotes de crédito disponíveis.
     * ROTA CORRIGIDA: A API do backend expõe os pacotes em /payments/packages.
     */
    async getPackages() {
        const response = await api.get('/payments/packages');
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Cria uma sessão de pagamento no Stripe.
     * FUNÇÃO NOVA: Substitui a antiga 'purchaseCredits'.
     * @param {object} data - Deve conter { amount, credits, currency: 'brl' }
     */
    async createStripePayment(data) {
        const response = await api.post('/payments/stripe/create', data);
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Cria uma preferência de pagamento no Mercado Pago.
     * FUNÇÃO NOVA: Substitui a antiga 'purchaseCredits'.
     * @param {object} data - Deve conter { amount, credits }
     */
    async createMercadoPagoPayment(data) {
        const response = await api.post('/payments/mercadopago/create', data);
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Busca o histórico de transações do usuário.
     * ROTA CORRIGIDA: O backend usa o endpoint /credits/history.
     * @param {number} page
     * @param {number} limit
     */
    async getTransactions(page = 1, limit = 10) {
        const response = await api.get('/credits/history', {
            params: { page, limit }
        });
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Busca uma transação específica pelo ID.
     * FUNÇÃO COMENTADA: Este endpoint (`/credits/transactions/:id`) não existe no backend.
     * A funcionalidade precisaria ser criada na API primeiro.
     */
    // async getTransaction(id) {
    //     const response = await api.get(`/credits/transactions/${id}`);
    //     return response.data.transaction;
    // }

    /**
     * Busca as estatísticas de crédito do usuário.
     * ROTA CORRETA: Esta rota já estava alinhada com o backend.
     */
    async getStats() {
        const response = await api.get('/credits/stats');
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Busca o saldo de créditos do usuário.
     * ROTA CORRETA: Esta rota já estava alinhada com o backend.
     */
    async getBalance() {
        const response = await api.get('/credits/balance');
        return response.data.data; // O backend encapsula os dados em um objeto 'data'
    }

    /**
     * Adiciona créditos a um usuário.
     * ROTA DE ADMIN: Esta rota existe, mas requer permissões de administrador.
     * @param {string} userId
     * @param {number} amount
     * @param {string} description
     */
    async addCredits(userId, amount, description) {
        const response = await api.post('/credits/add', {
            user_id: userId,
            amount,
            description
        });
        return response.data.data;
    }
}

export default new CreditsService();