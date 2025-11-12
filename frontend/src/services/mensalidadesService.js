// frontend/src/services/mensalidadesService.js

import api from './api'; // Importa a instância configurada do Axios (com baseURL e token)

const endpoint = '/mensalidades';

/**
 * Busca a lista de mensalidades (abertas/em atraso) para o controle de inadimplência.
 */
export const getInadimplentes = async () => {
    try {
        // GET para o endpoint: http://localhost:8081/api/mensalidades/inadimplentes
        const response = await api.get(`${endpoint}/inadimplentes`);
        return response.data; // Retorna a lista de mensalidades
    } catch (error) {
        console.error('Erro ao buscar inadimplentes:', error);
        throw error;
    }
};

/**
 * Registra um pagamento (total ou parcial) para uma mensalidade.
 * @param {number} idMensalidade
 * @param {object} dadosPagamento - { valorPago, dataPagamento, metodoPagamento }
 */
export const registrarPagamento = async (idMensalidade, dadosPagamento) => {
    try {
        // POST para o endpoint: http://localhost:8081/api/mensalidades/{idMensalidade}/pagamento
        const response = await api.post(
            `${endpoint}/${idMensalidade}/pagamento`, 
            dadosPagamento
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        throw error;
    }
};

/**
 * Função para gerenciar o cancelamento/ativação de serviço (opcional)
 * @param {number} idResponsavel
 */
export const alternarStatusServico = async (idResponsavel) => {
    try {
        // PUT para o endpoint: http://localhost:8081/api/responsaveis/{idResponsavel}/status
        const response = await api.put(`/responsaveis/${idResponsavel}/status`);
        return response.data;
    } catch (error) {
        console.error('Erro ao alternar status do serviço:', error);
        throw error;
    }
};