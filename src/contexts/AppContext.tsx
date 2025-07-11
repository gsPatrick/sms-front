'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import AuthService, { User } from '@/services/auth';
import SmsService, { SmsNumber, SmsService as SmsServiceType, SmsCountry } from '@/services/sms';
import CreditsService, { Transaction, CreditPackage } from '@/services/credits';

interface AppContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // SMS Numbers
  smsNumbers: SmsNumber[];
  
  // Transactions
  transactions: Transaction[];
  
  // Services and Countries
  services: SmsServiceType[];
  countries: SmsCountry[];
  
  // Credit Packages
  creditPackages: CreditPackage[];
  
  // Statistics
  stats: {
    credits: number;
    usedToday: number;
    successRate: number;
    activeNumbers: number;
    totalNumbers: number;
    receivedToday: number;
    totalSpent: number;
    pendingCredits: number;
  };
  
  // Loading states
  loading: {
    smsNumbers: boolean;
    transactions: boolean;
    newNumber: boolean;
    payment: boolean;
    auth: boolean;
    stats: boolean;
  };
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  createSmsNumber: (service: string, country: string) => Promise<SmsNumber>;
  refreshSmsNumber: (id: string) => Promise<SmsNumber>;
  cancelSmsNumber: (id: string) => Promise<void>;
  purchaseCredits: (packageId: string, paymentMethod: string, paymentData?: any) => Promise<void>;
  refreshData: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [smsNumbers, setSmsNumbers] = useState<SmsNumber[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services, setServices] = useState<SmsServiceType[]>([]);
  const [countries, setCountries] = useState<SmsCountry[]>([]);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [stats, setStats] = useState({
    credits: 0,
    usedToday: 0,
    successRate: 0,
    activeNumbers: 0,
    totalNumbers: 0,
    receivedToday: 0,
    totalSpent: 0,
    pendingCredits: 0
  });
  const [loading, setLoading] = useState({
    smsNumbers: false,
    transactions: false,
    newNumber: false,
    payment: false,
    auth: false,
    stats: false
  });

  const isAuthenticated = !!user;

  // Carregar dados iniciais
  useEffect(() => {
    const initializeApp = async () => {
      if (AuthService.isAuthenticated()) {
        await loadUserProfile();
      }
      await loadStaticData();
    };

    initializeApp();
  }, []);

  // Carregar dados quando usuário faz login
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadStaticData = async () => {
    try {
      const [servicesData, countriesData, packagesData] = await Promise.all([
        SmsService.getServices(),
        SmsService.getCountries(),
        CreditsService.getPackages()
      ]);

      setServices(servicesData);
      setCountries(countriesData);
      setCreditPackages(packagesData);
    } catch (error) {
      console.error('Erro ao carregar dados estáticos:', error);
    }
  };

  const loadUserProfile = async () => {
    setLoading(prev => ({ ...prev, auth: true }));
    try {
      const userData = await AuthService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      AuthService.logout();
    } finally {
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  const loadUserData = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(prev => ({ ...prev, smsNumbers: true, transactions: true, stats: true }));

      const [numbersData, transactionsData, smsStats, creditStats] = await Promise.all([
        SmsService.getNumbers(),
        CreditsService.getTransactions(1, 10),
        SmsService.getStats(),
        CreditsService.getStats()
      ]);

      setSmsNumbers(numbersData);
      setTransactions(transactionsData.transactions);
      
      setStats({
        credits: user?.credits || 0,
        usedToday: smsStats.receivedToday,
        successRate: smsStats.successRate,
        activeNumbers: smsStats.activeNumbers,
        totalNumbers: smsStats.totalNumbers,
        receivedToday: smsStats.receivedToday,
        totalSpent: creditStats.totalSpent,
        pendingCredits: 0
      });

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      message.error('Erro ao carregar dados');
    } finally {
      setLoading(prev => ({ ...prev, smsNumbers: false, transactions: false, stats: false }));
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(prev => ({ ...prev, auth: true }));
    try {
      const { user: userData } = await AuthService.login({ email, password });
      setUser(userData);
      message.success('Login realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
      setSmsNumbers([]);
      setTransactions([]);
      setStats({
        credits: 0,
        usedToday: 0,
        successRate: 0,
        activeNumbers: 0,
        totalNumbers: 0,
        receivedToday: 0,
        totalSpent: 0,
        pendingCredits: 0
      });
      message.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(prev => ({ ...prev, auth: true }));
    try {
      const { user: userData } = await AuthService.register({ name, email, password });
      setUser(userData);
      message.success('Conta criada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  const createSmsNumber = async (service: string, country: string): Promise<SmsNumber> => {
    setLoading(prev => ({ ...prev, newNumber: true }));
    try {
      const newNumber = await SmsService.createNumber({ service, country });
      setSmsNumbers(prev => [newNumber, ...prev]);
      
      // Atualizar créditos do usuário
      if (user) {
        setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      }
      
      message.success('Número solicitado com sucesso!');
      return newNumber;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar número';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, newNumber: false }));
    }
  };

  const refreshSmsNumber = async (id: string): Promise<SmsNumber> => {
    try {
      const updatedNumber = await SmsService.refreshNumber(id);
      setSmsNumbers(prev => 
        prev.map(num => num.id === id ? updatedNumber : num)
      );
      
      if (updatedNumber.code) {
        message.success('Código recebido!');
      } else {
        message.info('Número atualizado');
      }
      
      return updatedNumber;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar número';
      message.error(errorMessage);
      throw error;
    }
  };

  const cancelSmsNumber = async (id: string): Promise<void> => {
    try {
      await SmsService.cancelNumber(id);
      setSmsNumbers(prev => 
        prev.map(num => 
          num.id === id ? { ...num, status: 'cancelled' as const } : num
        )
      );
      
      // Reembolsar crédito
      if (user) {
        setUser(prev => prev ? { ...prev, credits: prev.credits + 1 } : null);
      }
      
      message.success('Número cancelado com sucesso');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao cancelar número';
      message.error(errorMessage);
      throw error;
    }
  };

  const purchaseCredits = async (packageId: string, paymentMethod: string, paymentData?: any): Promise<void> => {
    setLoading(prev => ({ ...prev, payment: true }));
    try {
      const result = await CreditsService.purchaseCredits({
        packageId,
        paymentMethod: paymentMethod as 'pix' | 'credit_card',
        paymentData
      });
      
      // Atualizar transações
      setTransactions(prev => [result.transaction, ...prev]);
      
      if (result.paymentUrl) {
        // Abrir URL de pagamento se necessário
        window.open(result.paymentUrl, '_blank');
      }
      
      message.success('Compra processada com sucesso!');
      
      // Recarregar dados do usuário
      await loadUserProfile();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao processar pagamento';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, payment: false }));
    }
  };

  const refreshData = async (): Promise<void> => {
    if (isAuthenticated) {
      await loadUserData();
    }
    await loadStaticData();
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    smsNumbers,
    transactions,
    services,
    countries,
    creditPackages,
    stats,
    loading,
    login,
    logout,
    register,
    createSmsNumber,
    refreshSmsNumber,
    cancelSmsNumber,
    purchaseCredits,
    refreshData,
    loadUserProfile
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

export default AppContext;

