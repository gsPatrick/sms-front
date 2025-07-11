import api from '@/lib/api';
class SmsApiService {
    async getNumbers() {
        const response = await api.get('/sms/numbers');
        return response.data.numbers;
    }
    async createNumber(data) {
        const response = await api.post('/sms/numbers', data);
        return response.data.number;
    }
    async getNumber(id) {
        const response = await api.get(`/sms/numbers/${id}`);
        return response.data.number;
    }
    async refreshNumber(id) {
        const response = await api.post(`/sms/numbers/${id}/refresh`);
        return response.data.number;
    }
    async cancelNumber(id) {
        await api.post(`/sms/numbers/${id}/cancel`);
    }
    async getServices() {
        const response = await api.get('/sms/services');
        return response.data.services;
    }
    async getCountries() {
        const response = await api.get('/sms/countries');
        return response.data.countries;
    }
    async getStats() {
        const response = await api.get('/sms/stats');
        return response.data.stats;
    }
    async getHistory(page = 1, limit = 10) {
        const response = await api.get('/sms/history', {
            params: { page, limit }
        });
        return response.data;
    }
}
export default new SmsApiService();
