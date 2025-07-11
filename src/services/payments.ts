import api from '@/lib/api';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'pix' | 'credit_card' | 'mercadopago';
  enabled: boolean;
  discount?: number;
}

export interface PixPayment {
  qrCode: string;
  qrCodeBase64: string;
  pixKey: string;
  amount: number;
  expiresAt: string;
}

export interface CreditCardPayment {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  method: string;
  createdAt: string;
  updatedAt: string;
}

class PaymentsService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payments/methods');
    return response.data.methods;
  }

  async createPixPayment(amount: number, description?: string): Promise<PixPayment> {
    const response = await api.post('/payments/pix', {
      amount,
      description
    });
    return response.data.payment;
  }

  async processCreditCardPayment(
    amount: number,
    cardData: CreditCardPayment,
    description?: string
  ): Promise<PaymentStatus> {
    const response = await api.post('/payments/credit-card', {
      amount,
      cardData,
      description
    });
    return response.data.payment;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data.payment;
  }

  async cancelPayment(paymentId: string): Promise<void> {
    await api.post(`/payments/${paymentId}/cancel`);
  }

  async confirmPixPayment(paymentId: string): Promise<PaymentStatus> {
    const response = await api.post(`/payments/${paymentId}/confirm`);
    return response.data.payment;
  }

  async getPaymentHistory(page = 1, limit = 10): Promise<{
    payments: PaymentStatus[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get('/payments/history', {
      params: { page, limit }
    });
    return response.data;
  }
}

export default new PaymentsService();

