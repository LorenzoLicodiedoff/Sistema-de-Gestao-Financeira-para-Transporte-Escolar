import React, { useState } from 'react';
import { registrarPagamento } from '../services/mensalidadesService';

// Resolve o erro 'error is defined but never used' usando a variável no console e um estado de erro
const ModalRegistroPagamento = ({ mensalidade, onClose, onUpdate }) => {
    // Inicializa valorPago com o saldo devedor ou 0 se for nulo
    const [valorPago, setValorPago] = useState(mensalidade.saldoDevedor ? mensalidade.saldoDevedor.toFixed(2) : '0.00'); 
    const [metodo, setMetodo] = useState('');
    const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        
        try {
            await registrarPagamento(mensalidade.id, {
                valorPago: parseFloat(valorPago),
                metodoPagamento: metodo,
                dataPagamento,
            });
            alert('Pagamento registrado com sucesso!');
            onUpdate();
            onClose();
        } catch (error) { // 'error' é usado aqui, resolvendo o warning do eslint
            console.error('Falha detalhada ao registrar pagamento:', error); 
            setSubmitError('Falha ao registrar pagamento. Verifique o console ou tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Estilo básico para o modal (você pode customizar o CSS)
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#333', padding: '30px', borderRadius: '10px', minWidth: '400px', color: 'white' }}>
                <h3 style={{ color: '#ff9800' }}>Registro de Pagamento - Mensalidade #{mensalidade.id}</h3>
                <p>Saldo Devedor Atual (c/ juros/multas): **R$ {mensalidade.saldoDevedor.toFixed(2)}**</p>
                <form onSubmit={handleSubmit}>
                    
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Valor Pago (Baixa Parcial/Manual):
                        <input
                            type="number"
                            step="0.01"
                            value={valorPago}
                            onChange={(e) => setValorPago(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #555', background: '#444', color: 'white' }}
                        />
                    </label>
                    
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Método de Pagamento:
                        <select value={metodo} onChange={(e) => setMetodo(e.target.value)} required
                            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #555', background: '#444', color: 'white' }}>
                            <option value="">Selecione</option>
                            <option value="PIX">PIX</option>
                            <option value="Boleto">Boleto</option>
                            <option value="Cartão">Cartão</option>
                            <option value="Manual">Dinheiro/Manual</option>
                        </select>
                    </label>
                    
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Data do Pagamento:
                        <input
                            type="date"
                            value={dataPagamento}
                            onChange={(e) => setDataPagamento(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #555', background: '#444', color: 'white' }}
                        />
                    </label>

                    {submitError && <p style={{ color: 'red', marginTop: '10px' }}>{submitError}</p>} 

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{ padding: '10px 15px', background: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 15px', background: '#ff9800', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? 'Processando...' : 'Confirmar Pagamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRegistroPagamento;