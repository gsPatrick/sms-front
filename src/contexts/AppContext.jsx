'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import AuthService from '@/services/auth';
import SmsService from '@/services/sms';
import CreditsService from '@/services/credits';
// Nota: A lógica de pagamento foi movida para um serviço dedicado, como deveria ser.
import PaymentsService from '@/services/payments';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [smsNumbers, setSmsNumbers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [services, setServices] = useState([]);
    const [countries, setCountries] = useState([]); // Mantido, mas será populado de forma diferente ou ficará vazio.
    const [creditPackages, setCreditPackages] = useState([]);
    const [stats, setStats] = useState({
        credits: 0,
        usedToday: 0,
        successRate: 0,
        activeNumbers: 0,
        totalNumbers: 0, // Este dado não está disponível, pode ser derivado de outra forma
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

    // --- LÓGICA DE CARREGAMENTO DE DADOS ---

    const loadStaticData = useCallback(async () => {
        try {
            // CORREÇÃO: A rota de pacotes está em /payments, não /credits.
            // CORREÇÃO: A rota de serviços está em /admin/services/available, não /sms/services.
            const [servicesData, packagesData] = await Promise.all([
                SmsService.getServices(),
                PaymentsService.getPaymentMethods() // Assumindo que getPackages foi movido para PaymentsService
            ]);
            setServices(servicesData);
            setCreditPackages(packagesData);

            // CORREÇÃO: O endpoint /sms/countries não existe no backend.
            // A lista de países agora deve vir de outra fonte ou ser omitida.
            // Por enquanto, deixaremos vazio.
            setCountries([]); 

        } catch (error) {
            console.error('Erro ao carregar dados estáticos:', error);
            message.error('Falha ao carregar dados de serviços e pacotes.');
        }
    }, []);

    const loadUserProfile = useCallback(async () => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            // CORREÇÃO: O endpoint correto é /auth/me, que é chamado por getProfile (assumindo correção no auth.js)
            const userData = await AuthService.getProfile();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            // Se falhar, faz logout para limpar o estado.
            AuthService.logout();
            setUser(null);
        } finally {
            setLoading(prev => ({ ...prev, auth: false }));
        }
    }, []);

    const loadUserData = useCallback(async (currentUser) => {
        if (!isAuthenticated) return;
        
        try {
            setLoading(prev => ({ ...prev, smsNumbers: true, transactions: true, stats: true }));

            // CORREÇÃO: Ajuste nas chamadas para endpoints corretos e existentes.
            // /sms/numbers -> /sms/active-numbers
            // /credits/transactions -> /credits/history
            // /sms/stats -> Não existe, foi removido.
            const [numbersData, transactionsHistory, creditStats] = await Promise.all([
                SmsService.getNumbers(),
                CreditsService.getTransactions(1, 10), // getTransactions agora chama /credits/history
                CreditsService.getStats()
            ]);
            
            setSmsNumbers(numbersData);
            setTransactions(transactionsHistory.transactions); // O backend retorna um objeto com uma chave 'transactions'
            
            // CORREÇÃO: Atualizando estatísticas com dados REAIS do backend.
            setStats({
                credits: currentUser?.credits || 0,
                activeNumbers: numbersData.length, // Calculado a partir dos dados recebidos
                totalSpent: creditStats.total_spent || 0, // O backend retorna 'total_spent'
                // Os dados abaixo não são fornecidos pelo backend, então são zerados.
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

    // Hook para carregar dados do usuário logado
    useEffect(() => {
        if (isAuthenticated && user) {
            loadUserData(user);
        }
    }, [isAuthenticated, user, loadUserData]);

    // Hook para inicialização do App
    useEffect(() => {
        const initializeApp = async () => {
            if (AuthService.isAuthenticated()) {
                await loadUserProfile();
            }
            await loadStaticData();
        };
        initializeApp();
    }, [loadUserProfile, loadStaticData]);


    // --- FUNÇÕES DE AUTENTICAÇÃO ---

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
            // CORREÇÃO: O backend espera 'username', não 'name'.
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

    // --- FUNÇÕES DE SMS ---

    const createSmsNumber = async (service, country) => {
        setLoading(prev => ({ ...prev, newNumber: true }));
        try {
            // CORREÇÃO: O backend espera 'service_code' e 'country_code'.
            const newNumber = await SmsService.createNumber({ service_code: service, country_code: country });
            setSmsNumbers(prev => [newNumber.active_number, ...prev]);
            
            // CORREÇÃO: Não decrementar o crédito manualmente. O backend já fez isso.
            // Recarregamos o perfil para obter o saldo de créditos atualizado.
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
            // CORREÇÃO: O endpoint correto é para reativar, não 'refresh'.
            const updatedNumber = await SmsService.reactivateNumber(id); // Assumindo que sms.js foi corrigido
            setSmsNumbers(prev => prev.map(num => num.id === id ? { ...num, status: 'active' } : num));
            
            // Após reativar, o código não vem de imediato. A verificação de status trará o código.
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

            // CORREÇÃO: Não reembolsar o crédito manualmente. O backend decide se há reembolso.
            // Recarregamos o perfil para obter o saldo de créditos correto.
            await loadUserProfile();

            message.success('Número cancelado com sucesso');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao cancelar número';
            message.error(errorMessage);
            throw error;
        }
    };


    // --- FUNÇÕES DE CRÉDITOS E PAGAMENTO ---

    const purchaseCredits = async (packageId, paymentMethod, paymentData) => {
        setLoading(prev => ({ ...prev, payment: true }));
        try {
            const selectedPackage = creditPackages.find(p => p.id === packageId);
            if (!selectedPackage) throw new Error("Pacote não encontrado");

            // CORREÇÃO: Lógica de compra totalmente refeita para se alinhar ao backend.
            // O frontend não chama mais um genérico '/credits/purchase', mas sim uma rota de pagamento específica.
            const result = await PaymentsService.createPaymentSession({
                gateway: paymentMethod, // ex: 'stripe' ou 'mercadopago'
                amount: selectedPackage.price,
                credits: selectedPackage.credits,
                currency: 'BRL',
                paymentData // Dados do cartão, etc.
            });
            
            // A transação já foi criada como 'pending' no backend.
            // Recarregamos as transações para exibi-la.
            await loadUserData(user);

            if (result.session_url || result.init_point) {
                // Abre URL de pagamento (Stripe ou Mercado Pago)
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

    // --- Valor do Contexto ---

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
        refreshData: () => {
             if (isAuthenticated) {
                loadUserProfile().then(loadedUser => {
                    if(loadedUser) loadUserData(loadedUser);
                });
            }
            loadStaticData();
        },
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