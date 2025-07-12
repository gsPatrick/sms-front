'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import AuthService from '@/services/auth';
import SmsService from '@/services/sms';
import CreditsService from '@/services/credits';
import PaymentsService from '@/services/payments';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [smsNumbers, setSmsNumbers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [services, setServices] = useState([]);
    const [countries, setCountries] = useState([]);
    const [creditPackages, setCreditPackages] = useState([]);
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

    // --- LÓGICA DE CARREGAMENTO DE DADOS (AGORA MEMORIZADA) ---

    // **CORREÇÃO**: Envolvemos a função em useCallback com um array de dependências vazio `[]`.
    // Isso garante que a função `loadStaticData` seja criada apenas uma vez e nunca mude,
    // quebrando o loop infinito.
    const loadStaticData = useCallback(async () => {
        try {
            const [servicesData, packagesData] = await Promise.all([
                SmsService.getServices(),
                PaymentsService.getPaymentMethods()
            ]);
            setServices(servicesData);
            setCreditPackages(packagesData);
            setCountries([]); // O endpoint não existe no backend.
        } catch (error) {
            console.error('Erro ao carregar dados estáticos:', error);
            message.error('Falha ao carregar dados de serviços e pacotes.');
        }
    }, []);

    // **CORREÇÃO**: Também memorizada com useCallback.
    const loadUserProfile = useCallback(async () => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            const userData = await AuthService.getProfile();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            AuthService.logout();
            setUser(null);
        } finally {
            setLoading(prev => ({ ...prev, auth: false }));
        }
    }, []);

    // **CORREÇÃO**: Memorizada, mas depende de `isAuthenticated`, que é o correto.
    const loadUserData = useCallback(async (currentUser) => {
        if (!isAuthenticated) return;
        
        setLoading(prev => ({ ...prev, smsNumbers: true, transactions: true, stats: true }));
        try {
            const [numbersData, transactionsHistory, creditStats] = await Promise.all([
                SmsService.getNumbers(),
                CreditsService.getTransactions(1, 10),
                CreditsService.getStats()
            ]);
            
            setSmsNumbers(numbersData);
            setTransactions(transactionsHistory.transactions);
            
            setStats({
                credits: currentUser?.credits || 0,
                activeNumbers: numbersData.length,
                totalSpent: creditStats.total_spent || 0,
                usedToday: 0, 
                successRate: 0,
                totalNumbers: 0,
                receivedToday: 0,
                pendingCredits: 0,
            });
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            message.error('Erro ao carregar seus dados.');
        } finally {
            setLoading(prev => ({ ...prev, smsNumbers: false, transactions: false, stats: false }));
        }
    }, [isAuthenticated]);

    // --- HOOKS DE EFEITO (AGORA ESTÁVEIS) ---

    useEffect(() => {
        if (isAuthenticated && user) {
            loadUserData(user);
        }
    }, [isAuthenticated, user, loadUserData]);

    useEffect(() => {
        const initializeApp = async () => {
            if (AuthService.isAuthenticated()) {
                await loadUserProfile();
            }
            await loadStaticData();
        };
        initializeApp();
    }, [loadUserProfile, loadStaticData]);


    // --- FUNÇÕES DE AÇÃO ---

    const login = async (email, password) => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            const { user: userData } = await AuthService.login({ email, password });
            setUser(userData);
            message.success('Login realizado com sucesso!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
            message.error(errorMessage);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, auth: false }));
        }
    };

    const register = async (name, email, password) => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            const { user: userData } = await AuthService.register({ username: name, email, password });
            setUser(userData);
            message.success('Conta criada com sucesso!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
            message.error(errorMessage);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, auth: false }));
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
        setSmsNumbers([]);
        setTransactions([]);
        setStats({ credits: 0, usedToday: 0, successRate: 0, activeNumbers: 0, totalNumbers: 0, receivedToday: 0, totalSpent: 0, pendingCredits: 0 });
        message.success('Logout realizado com sucesso!');
    };

    const createSmsNumber = async (service, country) => {
        setLoading(prev => ({ ...prev, newNumber: true }));
        try {
            const newNumber = await SmsService.createNumber({ service_code: service, country_code: country });
            setSmsNumbers(prev => [newNumber.active_number, ...prev]);
            await loadUserProfile();
            message.success('Número solicitado com sucesso!');
            return newNumber;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao solicitar número';
            message.error(errorMessage);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, newNumber: false }));
        }
    };

    const refreshSmsNumber = async (id) => {
        try {
            const updatedNumber = await SmsService.reactivateNumber(id);
            setSmsNumbers(prev => prev.map(num => num.id === id ? { ...num, status: 'active' } : num));
            message.info('Número reativado. Verifique o status para obter o novo código.');
            return updatedNumber;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao reativar número';
            message.error(errorMessage);
            throw error;
        }
    };

    const cancelSmsNumber = async (id) => {
        try {
            await SmsService.cancelNumber(id);
            setSmsNumbers(prev => prev.map(num => num.id === id ? { ...num, status: 'cancelled' } : num));
            await loadUserProfile();
            message.success('Número cancelado com sucesso');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao cancelar número';
            message.error(errorMessage);
            throw error;
        }
    };

    const purchaseCredits = async (packageId, paymentMethod, paymentData) => {
        setLoading(prev => ({ ...prev, payment: true }));
        try {
            const selectedPackage = creditPackages.find(p => p.id === packageId);
            if (!selectedPackage) throw new Error("Pacote não encontrado");

            const result = await PaymentsService.createPaymentSession({
                gateway: paymentMethod,
                amount: selectedPackage.price,
                credits: selectedPackage.credits,
                currency: 'BRL',
                paymentData
            });
            
            await loadUserData(user);

            if (result.session_url || result.init_point) {
                window.open(result.session_url || result.init_point, '_blank');
                message.info('Você foi redirecionado para a página de pagamento.');
            } else {
                 message.success('Processando sua compra!');
            }
           
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao processar pagamento';
            message.error(errorMessage);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, payment: false }));
        }
    };

    const value = {
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
        // **CORREÇÃO**: A função refreshData também é memorizada para estabilidade.
        refreshData: useCallback(() => {
            if (isAuthenticated) {
                loadUserProfile().then(loadedUser => {
                    if (loadedUser) loadUserData(loadedUser);
                });
            }
            loadStaticData();
        }, [isAuthenticated, loadUserProfile, loadUserData, loadStaticData]),
        loadUserProfile
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};

export default AppContext;