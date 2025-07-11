import api from '@/lib/api';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
  bonus?: number;
  features: string[];
}

export interface Transaction {
  id: string;
  type: 'credit_purchase' | 'sms_usage' | 'refund';
  amount: number;
  credits: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  paymentMethod?: string;
}

export interface PurchaseCreditsData {
  packageId: string;
  paymentMethod: 'pix' | 'credit_card';
  paymentData?: any;
}

export interface CreditStats {
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  totalSpent: number;
}

class CreditsService {
  async getPackages(): Promise<CreditPackage[]> {
    const response = await api.get('/credits/packages');
    return response.data.packages;
  }

  async purchaseCredits(data: PurchaseCreditsData): Promise<{
    transaction: Transaction;
    paymentUrl?: string;
  }> {
    const response = await api.post('/credits/purchase', data);
    return response.data;
  }

  async getTransactions(page = 1, limit = 10): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get('/credits/transactions', {
      params: { page, limit }
    });
    return response.data;
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get(`/credits/transactions/${id}`);
    return response.data.transaction;
  }

  async getStats(): Promise<CreditStats> {
    const response = await api.get('/credits/stats');
    return response.data.stats;
  }

  async getBalance(): Promise<{ credits: number }> {
    const response = await api.get('/credits/balance');
    return response.data;
  }

  async addCredits(amount: number, description?: string): Promise<Transaction> {
    const response = await api.post('/credits/add', {
      amount,
      description
    });
    return response.data.transaction;
  }
}

export default new CreditsService();

