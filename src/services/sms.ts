import api from '@/lib/api';

export interface SmsNumber {
  id: string;
  service: string;
  country: string;
  number: string;
  code?: string;
  status: 'waiting' | 'received' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  cost: number;
}

export interface CreateSmsNumberData {
  service: string;
  country: string;
}

export interface SmsService {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface SmsCountry {
  id: string;
  name: string;
  code: string;
  price: number;
  available: boolean;
}

export interface SmsStats {
  totalNumbers: number;
  activeNumbers: number;
  receivedToday: number;
  successRate: number;
}

class SmsApiService {
  async getNumbers(): Promise<SmsNumber[]> {
    const response = await api.get('/sms/numbers');
    return response.data.numbers;
  }

  async createNumber(data: CreateSmsNumberData): Promise<SmsNumber> {
    const response = await api.post('/sms/numbers', data);
    return response.data.number;
  }

  async getNumber(id: string): Promise<SmsNumber> {
    const response = await api.get(`/sms/numbers/${id}`);
    return response.data.number;
  }

  async refreshNumber(id: string): Promise<SmsNumber> {
    const response = await api.post(`/sms/numbers/${id}/refresh`);
    return response.data.number;
  }

  async cancelNumber(id: string): Promise<void> {
    await api.post(`/sms/numbers/${id}/cancel`);
  }

  async getServices(): Promise<SmsService[]> {
    const response = await api.get('/sms/services');
    return response.data.services;
  }

  async getCountries(): Promise<SmsCountry[]> {
    const response = await api.get('/sms/countries');
    return response.data.countries;
  }

  async getStats(): Promise<SmsStats> {
    const response = await api.get('/sms/stats');
    return response.data.stats;
  }

  async getHistory(page = 1, limit = 10): Promise<{
    numbers: SmsNumber[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get('/sms/history', {
      params: { page, limit }
    });
    return response.data;
  }
}

export default new SmsApiService();

