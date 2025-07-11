import api from '@/lib/api';
class CreditsService {
    async getPackages() {
        const response = await api.get('/credits/packages');
        return response.data.packages;
    }
    async purchaseCredits(data) {
        const response = await api.post('/credits/purchase', data);
        return response.data;
    }
    async getTransactions(page = 1, limit = 10) {
        const response = await api.get('/credits/transactions', {
            params: { page, limit }
        });
        return response.data;
    }
    async getTransaction(id) {
        const response = await api.get(`/credits/transactions/${id}`);
        return response.data.transaction;
    }
    async getStats() {
        const response = await api.get('/credits/stats');
        return response.data.stats;
    }
    async getBalance() {
        const response = await api.get('/credits/balance');
        return response.data;
    }
    async addCredits(amount, description) {
        const response = await api.post('/credits/add', {
            amount,
            description
        });
        return response.data.transaction;
    }
}
export default new CreditsService();
