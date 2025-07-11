'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import AuthService from '@/services/auth';
import SmsService from '@/services/sms';
import CreditsService from '@/services/credits';
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
        }
        catch (error) {
            console.error('Erro ao carregar dados estáticos:', error);
        }
    };
    const loadUserProfile = async () => {
        setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: true })));
        try {
            const userData = await AuthService.getProfile();
            setUser(userData);
        }
        catch (error) {
            console.error('Erro ao carregar perfil:', error);
            AuthService.logout();
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: false })));
        }
    };
    const loadUserData = async () => {
        if (!isAuthenticated)
            return;
        try {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { smsNumbers: true, transactions: true, stats: true })));
            const [numbersData, transactionsData, smsStats, creditStats] = await Promise.all([
                SmsService.getNumbers(),
                CreditsService.getTransactions(1, 10),
                SmsService.getStats(),
                CreditsService.getStats()
            ]);
            setSmsNumbers(numbersData);
            setTransactions(transactionsData.transactions);
            setStats({
                credits: (user === null || user === void 0 ? void 0 : user.credits) || 0,
                usedToday: smsStats.receivedToday,
                successRate: smsStats.successRate,
                activeNumbers: smsStats.activeNumbers,
                totalNumbers: smsStats.totalNumbers,
                receivedToday: smsStats.receivedToday,
                totalSpent: creditStats.totalSpent,
                pendingCredits: 0
            });
        }
        catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            message.error('Erro ao carregar dados');
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { smsNumbers: false, transactions: false, stats: false })));
        }
    };
    const login = async (email, password) => {
        var _a, _b;
        setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: true })));
        try {
            const { user: userData } = await AuthService.login({ email, password });
            setUser(userData);
            message.success('Login realizado com sucesso!');
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao fazer login';
            message.error(errorMessage);
            throw error;
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: false })));
        }
    };
    const logout = async () => {
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
        }
        catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    const register = async (name, email, password) => {
        var _a, _b;
        setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: true })));
        try {
            const { user: userData } = await AuthService.register({ name, email, password });
            setUser(userData);
            message.success('Conta criada com sucesso!');
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao criar conta';
            message.error(errorMessage);
            throw error;
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { auth: false })));
        }
    };
    const createSmsNumber = async (service, country) => {
        var _a, _b;
        setLoading(prev => (Object.assign(Object.assign({}, prev), { newNumber: true })));
        try {
            const newNumber = await SmsService.createNumber({ service, country });
            setSmsNumbers(prev => [newNumber, ...prev]);
            // Atualizar créditos do usuário
            if (user) {
                setUser(prev => prev ? Object.assign(Object.assign({}, prev), { credits: prev.credits - 1 }) : null);
            }
            message.success('Número solicitado com sucesso!');
            return newNumber;
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao solicitar número';
            message.error(errorMessage);
            throw error;
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { newNumber: false })));
        }
    };
    const refreshSmsNumber = async (id) => {
        var _a, _b;
        try {
            const updatedNumber = await SmsService.refreshNumber(id);
            setSmsNumbers(prev => prev.map(num => num.id === id ? updatedNumber : num));
            if (updatedNumber.code) {
                message.success('Código recebido!');
            }
            else {
                message.info('Número atualizado');
            }
            return updatedNumber;
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao atualizar número';
            message.error(errorMessage);
            throw error;
        }
    };
    const cancelSmsNumber = async (id) => {
        var _a, _b;
        try {
            await SmsService.cancelNumber(id);
            setSmsNumbers(prev => prev.map(num => num.id === id ? Object.assign(Object.assign({}, num), { status: 'cancelled' }) : num));
            // Reembolsar crédito
            if (user) {
                setUser(prev => prev ? Object.assign(Object.assign({}, prev), { credits: prev.credits + 1 }) : null);
            }
            message.success('Número cancelado com sucesso');
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao cancelar número';
            message.error(errorMessage);
            throw error;
        }
    };
    const purchaseCredits = async (packageId, paymentMethod, paymentData) => {
        var _a, _b;
        setLoading(prev => (Object.assign(Object.assign({}, prev), { payment: true })));
        try {
            const result = await CreditsService.purchaseCredits({
                packageId,
                paymentMethod: paymentMethod,
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
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erro ao processar pagamento';
            message.error(errorMessage);
            throw error;
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { payment: false })));
        }
    };
    const refreshData = async () => {
        if (isAuthenticated) {
            await loadUserData();
        }
        await loadStaticData();
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
        refreshData,
        loadUserProfile
    };
    return (<AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};
export default AppContext;
