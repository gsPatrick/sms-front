// Mock data para demonstração da aplicação
// Mock User
export const mockUser = {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    credits: 1250,
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z'
};
// Mock SMS Numbers
export const mockSmsNumbers = [
    {
        id: '1',
        service: 'WhatsApp',
        country: 'Brasil',
        number: '+55 11 99999-1234',
        code: '123456',
        status: 'received',
        createdAt: '2024-01-15T14:30:00Z',
        expiresAt: '2024-01-15T14:45:00Z',
        cost: 0.15
    },
    {
        id: '2',
        service: 'Telegram',
        country: 'Estados Unidos',
        number: '+1 555 123-4567',
        status: 'waiting',
        createdAt: '2024-01-15T14:25:00Z',
        expiresAt: '2024-01-15T14:40:00Z',
        cost: 0.20
    },
    {
        id: '3',
        service: 'Instagram',
        country: 'Reino Unido',
        number: '+44 20 7946 0958',
        status: 'expired',
        createdAt: '2024-01-15T14:15:00Z',
        expiresAt: '2024-01-15T14:30:00Z',
        cost: 0.25
    },
    {
        id: '4',
        service: 'Facebook',
        country: 'Alemanha',
        number: '+49 30 12345678',
        code: '789012',
        status: 'received',
        createdAt: '2024-01-15T13:45:00Z',
        expiresAt: '2024-01-15T14:00:00Z',
        cost: 0.18
    },
    {
        id: '5',
        service: 'Twitter',
        country: 'França',
        number: '+33 1 23 45 67 89',
        status: 'cancelled',
        createdAt: '2024-01-15T13:30:00Z',
        expiresAt: '2024-01-15T13:45:00Z',
        cost: 0.22
    }
];
// Mock Transactions
export const mockTransactions = [
    {
        id: '1',
        type: 'credit_purchase',
        amount: 180.00,
        credits: 1500,
        status: 'completed',
        description: 'Compra de créditos - Pacote Profissional',
        createdAt: '2024-01-15T10:00:00Z',
        paymentMethod: 'PIX'
    },
    {
        id: '2',
        type: 'sms_usage',
        amount: -0.15,
        credits: -1,
        status: 'completed',
        description: 'SMS WhatsApp - Brasil',
        createdAt: '2024-01-15T14:30:00Z'
    },
    {
        id: '3',
        type: 'sms_usage',
        amount: -0.20,
        credits: -1,
        status: 'completed',
        description: 'SMS Telegram - Estados Unidos',
        createdAt: '2024-01-15T14:25:00Z'
    },
    {
        id: '4',
        type: 'credit_purchase',
        amount: 65.00,
        credits: 500,
        status: 'completed',
        description: 'Compra de créditos - Pacote Básico',
        createdAt: '2024-01-10T15:30:00Z',
        paymentMethod: 'Cartão de Crédito'
    }
];
// Mock Credit Packages
export const mockCreditPackages = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 100,
        price: 15.00,
        features: [
            'Ideal para testes',
            'Suporte por email',
            'Validade de 30 dias'
        ]
    },
    {
        id: 'basic',
        name: 'Básico',
        credits: 500,
        price: 65.00,
        originalPrice: 75.00,
        discount: 13,
        bonus: 50,
        features: [
            'Perfeito para pequenos projetos',
            'Suporte prioritário',
            'Validade de 60 dias',
            '+50 créditos bônus'
        ]
    },
    {
        id: 'professional',
        name: 'Profissional',
        credits: 1500,
        price: 180.00,
        originalPrice: 225.00,
        discount: 20,
        bonus: 200,
        popular: true,
        features: [
            'Ideal para empresas',
            'Suporte 24/7',
            'Validade de 90 dias',
            '+200 créditos bônus',
            'API rate limit aumentado'
        ]
    },
    {
        id: 'enterprise',
        name: 'Empresarial',
        credits: 5000,
        price: 550.00,
        originalPrice: 750.00,
        discount: 27,
        bonus: 1000,
        features: [
            'Para grandes volumes',
            'Gerente de conta dedicado',
            'Validade de 180 dias',
            '+1000 créditos bônus',
            'SLA garantido',
            'Relatórios personalizados'
        ]
    }
];
// Mock Services
export const mockServices = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', price: 0.15, available: true },
    { id: 'telegram', name: 'Telegram', icon: '✈️', price: 0.12, available: true },
    { id: 'instagram', name: 'Instagram', icon: '📷', price: 0.18, available: true },
    { id: 'facebook', name: 'Facebook', icon: '👥', price: 0.16, available: true },
    { id: 'twitter', name: 'Twitter', icon: '🐦', price: 0.14, available: true },
    { id: 'google', name: 'Google', icon: '🔍', price: 0.20, available: true },
    { id: 'microsoft', name: 'Microsoft', icon: '🪟', price: 0.22, available: true },
    { id: 'discord', name: 'Discord', icon: '🎮', price: 0.13, available: true }
];
// Mock Countries
export const mockCountries = [
    { id: 'br', name: 'Brasil', code: '+55', flag: '🇧🇷', price: 0.15, available: true },
    { id: 'us', name: 'Estados Unidos', code: '+1', flag: '🇺🇸', price: 0.20, available: true },
    { id: 'uk', name: 'Reino Unido', code: '+44', flag: '🇬🇧', price: 0.25, available: true },
    { id: 'de', name: 'Alemanha', code: '+49', flag: '🇩🇪', price: 0.18, available: true },
    { id: 'fr', name: 'França', code: '+33', flag: '🇫🇷', price: 0.22, available: true },
    { id: 'es', name: 'Espanha', code: '+34', flag: '🇪🇸', price: 0.19, available: true },
    { id: 'it', name: 'Itália', code: '+39', flag: '🇮🇹', price: 0.21, available: true },
    { id: 'ca', name: 'Canadá', code: '+1', flag: '🇨🇦', price: 0.17, available: true },
    { id: 'au', name: 'Austrália', code: '+61', flag: '🇦🇺', price: 0.24, available: true },
    { id: 'jp', name: 'Japão', code: '+81', flag: '🇯🇵', price: 0.26, available: true }
];
// Mock Statistics
export const mockStats = {
    credits: 1250,
    usedToday: 45,
    successRate: 98.5,
    activeNumbers: 3,
    totalNumbers: 127,
    receivedToday: 42,
    totalSpent: 245.50,
    pendingCredits: 0
};
// Utility functions for mock API simulation
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const mockApiCall = async (data, delayMs = 1000) => {
    await delay(delayMs);
    return data;
};
export const mockApiError = async (message, delayMs = 1000) => {
    await delay(delayMs);
    throw new Error(message);
};
