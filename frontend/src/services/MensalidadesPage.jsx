// frontend/src/pages/MensalidadesPage.jsx

import React, { useState, useEffect } from 'react';
import { getInadimplentes } from '../services/mensalidadesService';
import ModalRegistroPagamento from '../components/ModalRegistroPagamento';
import './style.css'; // Supondo que você use um arquivo de estilo comum

const MensalidadesPage = () => {
    const [mensalidades, setMensalidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState(null);

    // Função para carregar os dados de inadimplência
    const fetchMensalidades = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chama a função do serviço para buscar inadimplentes no backend
            const data = await getInadimplentes(); 
            setMensalidades(data);
        } catch (err) {
            console.error("Erro ao carregar mensalidades:", err);
            setError("Não foi possível carregar a lista de mensalidades e inadimplentes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMensalidades();
    }, []);

    // Abre o modal para registrar pagamento
    const handleAbrirRegistro = (mensalidade) => {
        setMensalidadeSelecionada(mensalidade);
        setModalOpen(true);
    };

    return (
        <div className="container">
            {/* Título da tela com o estilo da sua imagem */}
            <h2 style={{ color: '#ff9800', textAlign: 'center', margin: '20px 0' }}>
                Gestão de Mensalidades e Inadimplência
            </h2>

            {/* Seção de Resumo/Filtros (Opcional, pode ser adicionado depois) */}
            <div className="summary-card" style={{ background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: 'white' }}>
                <h3>Controle Rápido</h3>
                {/* Você pode adicionar campos de filtro aqui para pesquisar por Responsável ou Status */}
                <p>Total de Parcelas em Atraso: **{mensalidades.filter(m => m.status === 'EM_ATRASO').length}**</p>
            </div>

            <hr style={{ borderTop: '1px solid #555' }} />

            {/* Listagem de Mensalidades (A Tabela de Inadimplência) */}
            <h3 style={{ color: 'white', marginTop: '20px' }}>Lista de Mensalidades a Pagar / Inadimplentes</h3>
            
            {loading && <p style={{ color: 'white' }}>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

            {!loading && !error && mensalidades.length > 0 ? (
                <TabelaMensalidades 
                    mensalidades={mensalidades} 
                    onAbrirRegistro={handleAbrirRegistro}
                />
            ) : (
                !loading && <p style={{ color: 'white', textAlign: 'center' }}>Nenhuma mensalidade em aberto ou em atraso.</p>
            )}

            {/* Modal de Registro de Pagamento */}
            {modalOpen && (
                <ModalRegistroPagamento
                    mensalidade={mensalidadeSelecionada}
                    onClose={() => setModalOpen(false)}
                    // Após registrar, atualiza a lista
                    onUpdate={fetchMensalidades} 
                />
            )}
        </div>
    );
};

export default MensalidadesPage;


// ==========================================================
// Componente de Tabela (Embutido na página por simplicidade)
// Idealmente, deve ser um componente separado: TabelaMensalidades.jsx
// ==========================================================

const TabelaMensalidades = ({ mensalidades, onAbrirRegistro }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', marginTop: '15px' }}>
            <thead>
                <tr style={{ background: '#555' }}>
                    <th style={{ padding: '10px', border: '1px solid #444' }}>Responsável</th>
                    <th style={{ padding: '10px', border: '1px solid #444' }}>Vencimento</th>
                    <th style={{ padding: '10px', border: '1px solid #444' }}>Valor Base</th>
                    <th style={{ padding: '10px', border: '1px solid #444', color: '#ff9800' }}>Saldo Devedor</th>
                    <th style={{ padding: '10px', border: '1px solid #444' }}>Status</th>
                    <th style={{ padding: '10px', border: '1px solid #444' }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {mensalidades.map((m) => (
                    <tr key={m.id} style={{ background: m.status === 'EM_ATRASO' ? '#442020' : '#2c2c2c' }}>
                        <td style={{ padding: '10px', border: '1px solid #444' }}>{m.responsavel.nome}</td>
                        <td style={{ padding: '10px', border: '1px solid #444' }}>{m.dataVencimento}</td>
                        <td style={{ padding: '10px', border: '1px solid #444' }}>R$ {m.valorBase.toFixed(2)}</td>
                        <td style={{ padding: '10px', border: '1px solid #444', fontWeight: 'bold', color: m.saldoDevedor > 0 ? '#f00' : '#0f0' }}>
                            R$ {m.saldoDevedor.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #444' }}>{m.status}</td>
                        <td style={{ padding: '10px', border: '1px solid #444' }}>
                            {m.status !== 'PAGA' && (
                                <button 
                                    onClick={() => onAbrirRegistro(m)}
                                    style={{ background: '#ff9800', color: 'black', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    Registrar Pagamento
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};