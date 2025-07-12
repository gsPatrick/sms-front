import api from '@/lib/api';

class CreditsService {
    async getPackages() {
        const response = await api.get('/payments/packages');
        return response.data.data;
    }

    async createStripePayment(data) {
        const response = await api.post('/payments/stripe/create', data);
        return response.data.data;
    }

    async createMercadoPagoPayment(data) {
        const response = await api.post('/payments/mercadopago/create', data);
        return response.data.data;
    }

    async getTransactions(page = 1, limit = 10) {
        const response = await api.get('/credits/history', {
            params: { page, limit }
        });
        return response.data.data;
    }

    async getStats() {
        const response = await api.get('/credits/stats');
        return response.data.data;
    }

    async getBalance() {
        const response = await api.get('/credits/balance');
        return response.data.data;
    }

    async addCredits(userId, amount, description) {
        const response = await api.post('/credits/add', {
            user_id: userId,
            amount,
            description
        });
        return response.data.data;
    }
}

// CORREÇÃO FINAL: Criando a instância antes de exportar
const creditsService = new CreditsService();
export default creditsService;