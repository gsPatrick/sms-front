import api from '@/lib/api';

class SmsApiService {
    async getNumbers() {
        const response = await api.get('/sms/active-numbers');
        return response.data.data || [];
    }

    async createNumber(data) {
        const payload = {
            service_code: data.service,
            country_code: data.country,
        };
        const response = await api.post('/sms/request-number', payload);
        return response.data.data.active_number;
    }

    async getNumber(id) {
        const response = await api.get(`/sms/status/${id}`);
        return response.data.data;
    }

    async refreshNumber(id) {
        const response = await api.post(`/sms/reactivate/${id}`);
        return response.data.data;
    }

    async cancelNumber(id) {
        await api.post(`/sms/cancel/${id}`);
    }

    async getServices() {
        const response = await api.get('/admin/services/available');
        return response.data.data || [];
    }

    async getCountries() {
        console.error("Endpoint GET /sms/countries não implementado no backend.");
        return [];
    }

    async getStats() {
        console.error("Endpoint GET /sms/stats não implementado no backend.");
        return {
            receivedToday: 0,
            successRate: 0,
            activeNumbers: 0,
            totalNumbers: 0,
        };
    }

    async getHistory(page = 1, limit = 10) {
        const response = await api.get('/sms/history', {
            params: { page, limit }
        });
        return response.data.data;
    }
}

// CORREÇÃO FINAL: Criando a instância antes de exportar
const smsApiService = new SmsApiService();
export default smsApiService;