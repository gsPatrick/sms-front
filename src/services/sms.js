// /services/sms.js - ARQUIVO CORRIGIDO

import api from '@/lib/api';

class SmsApiService {
    /**
     * CORRIGIDO: Busca os números ativos do usuário.
     * Endpoint original: /sms/numbers -> Endpoint correto: /sms/active-numbers
     * O backend retorna os dados dentro de `data.data`.
     */
    async getNumbers() {
        const response = await api.get('/sms/active-numbers');
        // No backend, a rota getActiveNumbers retorna { success: true, message: '...', data: [...] }
        return response.data.data || [];
    }

    /**
     * CORRIGIDO: Solicita um novo número para um serviço e país.
     * Endpoint original: POST /sms/numbers -> Endpoint correto: POST /sms/request-number
     * Payload original: { service, country } -> Payload correto: { service_code, country_code }
     */
    async createNumber(data) { // data é um objeto { service, country }
        // Mapeia os dados do frontend para o formato esperado pelo backend
        const payload = {
            service_code: data.service,
            country_code: data.country,
        };
        const response = await api.post('/sms/request-number', payload);
        // O backend retorna um objeto complexo: data: { active_number, sms_message, service }
        // O frontend provavelmente espera apenas o objeto do número ativo.
        return response.data.data.active_number;
    }

    /**
     * CORRIGIDO: Verifica o status de um número ativo para obter o código.
     * Endpoint original: GET /sms/numbers/${id} -> Endpoint correto: GET /sms/status/${id}
     * A funcionalidade original era "obter número", mas no backend é "verificar status".
     */
    async getNumber(id) {
        const response = await api.get(`/sms/status/${id}`);
        // O backend retorna data: { active_number, status, code, service }
        // O frontend precisará tratar essa estrutura mais complexa.
        return response.data.data;
    }

    /**
     * CORRIGIDO: Solicita um novo SMS para o mesmo número (reativação).
     * Endpoint original: POST /sms/numbers/${id}/refresh -> Endpoint correto: POST /sms/reactivate/${id}
     */
    async refreshNumber(id) {
        const response = await api.post(`/sms/reactivate/${id}`);
        return response.data.data; // Retorna o número ativo atualizado
    }

    /**
     * CORRIGIDO: Cancela um número ativo.
     * Endpoint original: POST /sms/numbers/${id}/cancel -> Endpoint correto: POST /sms/cancel/${id}
     */
    async cancelNumber(id) {
        // Esta rota não retorna um corpo na resposta, apenas status 200.
        await api.post(`/sms/cancel/${id}`);
    }

    /**
     * CORRIGIDO: Busca a lista de serviços disponíveis.
     * Endpoint original: /sms/services -> Endpoint correto: /admin/services/available
     */
    async getServices() {
        const response = await api.get('/admin/services/available');
        return response.data.data || [];
    }

    /**
     * PENDENTE: O backend não implementa esta rota.
     * A função foi mantida como placeholder para não quebrar a UI.
     */
    async getCountries() {
        // ATENÇÃO: O backend não possui um endpoint para listar os países.
        // Esta função é um placeholder e precisa que o endpoint seja criado no backend.
        // Um endpoint sugerido seria GET /api/sms/countries
        console.error("Endpoint GET /sms/countries não implementado no backend.");
        return []; // Retorna um array vazio para evitar que a UI quebre
    }

    /**
     * PENDENTE: O backend não implementa esta rota.
     * A função foi mantida como placeholder para não quebrar a UI.
     */
    async getStats() {
        // ATENÇÃO: O backend não possui um endpoint para estatísticas de SMS.
        // Esta função é um placeholder. O frontend espera um objeto com os totais.
        // Um endpoint sugerido seria GET /api/sms/stats
        console.error("Endpoint GET /sms/stats não implementado no backend.");
        // Retorna um objeto com valores padrão para evitar erros de 'undefined' na UI
        return {
            receivedToday: 0,
            successRate: 0,
            activeNumbers: 0,
            totalNumbers: 0,
        };
    }

    /**
     * CORRETO: Busca o histórico de SMS do usuário.
     * A rota já estava correta, apenas ajustado para o padrão de retorno `data.data`.
     */
    async getHistory(page = 1, limit = 10) {
        const response = await api.get('/sms/history', {
            params: { page, limit }
        });
        // O backend retorna: { data: { messages, pagination } }
        return response.data.data;
    }
}

export default new SmsApiService();