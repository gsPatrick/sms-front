import api from '@/lib/api';
class PaymentsService {
    async getPaymentMethods() {
        const response = await api.get('/payments/methods');
        return response.data.methods;
    }
    async createPixPayment(amount, description) {
        const response = await api.post('/payments/pix', {
            amount,
            description
        });
        return response.data.payment;
    }
    async processCreditCardPayment(amount, cardData, description) {
        const response = await api.post('/payments/credit-card', {
            amount,
            cardData,
            description
        });
        return response.data.payment;
    }
    async getPaymentStatus(paymentId) {
        const response = await api.get(`/payments/${paymentId}/status`);
        return response.data.payment;
    }
    async cancelPayment(paymentId) {
        await api.post(`/payments/${paymentId}/cancel`);
    }
    async confirmPixPayment(paymentId) {
        const response = await api.post(`/payments/${paymentId}/confirm`);
        return response.data.payment;
    }
    async getPaymentHistory(page = 1, limit = 10) {
        const response = await api.get('/payments/history', {
            params: { page, limit }
        });
        return response.data;
    }
}

// CORREÇÃO FINAL: Criando a instância antes de exportar
const paymentsService = new PaymentsService();
export default paymentsService;