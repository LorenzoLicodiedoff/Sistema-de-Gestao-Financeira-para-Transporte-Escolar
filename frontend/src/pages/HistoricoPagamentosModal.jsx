import React, { useState, useEffect } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- MUDANÇA 1

// Helper para formatar BRL (R$)
const formatarBRL = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor);
};

// O componente recebe o 'aluno' e a função 'onClose' como props
export default function HistoricoPagamentosModal({ aluno, onClose }) {
    
    const [historico, setHistorico] = useState([]);
    const [mensagem, setMensagem] = useState('Carregando...');
    const [novoPagamento, setNovoPagamento] = useState({
        valor: "",
        dataVencimento: new Date().toISOString().split('T')[0],
        status: "PENDENTE"
    });

    // 1. Função para buscar o histórico do aluno
    const buscarHistorico = () => {
        api.get(`/pagamentos/aluno/${aluno.id}`)
            .then(response => {
                setHistorico(response.data);
                setMensagem(response.data.length === 0 ? "Nenhum pagamento registado." : "");
            })
            .catch(error => {
                console.error("Erro ao buscar pagamentos:", error);
                setMensagem("Erro ao carregar histórico.");
            });
    };

    // 2. useEffect: Roda UMA VEZ para buscar o histórico
    useEffect(() => {
        buscarHistorico();
    }, [aluno.id]); 

    // 3. Função para salvar um novo pagamento
    const handleSalvarPagamento = () => {
        if (!novoPagamento.valor || !novoPagamento.dataVencimento) {
            alert("Preencha o Valor e a Data de Vencimento.");
            return;
        }

        const pagamentoParaSalvar = {
            valor: parseFloat(novoPagamento.valor),
            dataVencimento: novoPagamento.dataVencimento,
            status: novoPagamento.status
        };

        api.post(`/pagamentos/aluno/${aluno.id}`, pagamentoParaSalvar)
            .then(() => {
                alert("Pagamento registado!");
                setNovoPagamento({ 
                    valor: "",
                    dataVencimento: new Date().toISOString().split('T')[0],
                    status: "PENDENTE"
                });
                buscarHistorico(); 
            })
            .catch(error => {
                console.error("Erro ao salvar pagamento:", error);
                alert("Erro ao salvar pagamento.");
            });
    };

    // 4. Função para gerar o PDF
    const gerarPDF = () => {
        if (!aluno) {
            alert("Aluno não encontrado.");
            return;
        }
        if (historico.length === 0) {
            alert("Não há pagamentos registados para gerar um relatório.");
            return;
        }

        // 1. Criar o documento
        const doc = new jsPDF();

        // 2. Definir o Título
        doc.setFontSize(18);
        doc.text("Histórico de Pagamentos", 14, 22);
        doc.setFontSize(12);
        doc.text(`Aluno: ${aluno.nome}`, 14, 30);
        
        // 3. Preparar os dados para a tabela
        const tableColumn = ["ID", "Vencimento", "Valor", "Status", "Data Pagamento"];
        const tableRows = [];

        let totalPago = 0;
        let totalPendente = 0;

        historico.forEach(p => {
            const pagamentoData = [
                p.id,
                p.dataVencimento,
                formatarBRL(p.valor), 
                p.status,
                p.dataPagamento || "---"
            ];
            tableRows.push(pagamentoData);

            if (p.status === 'PAGO') {
                totalPago += parseFloat(p.valor);
            } else {
                totalPendente += parseFloat(p.valor);
            }
        });

        // 4. Adicionar a tabela ao PDF
        // --- MUDANÇA 2 ---
        autoTable(doc, {
            startY: 40, 
            head: [tableColumn],
            body: tableRows,
        });

        // 5. Adicionar o Resumo (Totalizadores)
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 40;
        
        doc.setFontSize(12);
        doc.text(`Total Pago: ${formatarBRL(totalPago)}`, 14, finalY + 10);
        doc.text(`Total Pendente: ${formatarBRL(totalPendente)}`, 14, finalY + 17);

        // 6. Salvar o arquivo
        doc.save(`historico_pagamentos_${aluno.nome.replace(" ", "_")}.pdf`);
    };

    // 5. Handler para o formulário de novo pagamento
    const handleChange = (e) => {
        setNovoPagamento(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        // O Fundo escuro (overlay)
        <div style={styles.overlay} onClick={onClose}>
            {/* A Janela Modal (evita fechar ao clicar dentro) */}
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                {/* Cabeçalho */}
                <div style={styles.header}>
                    <h3>Histórico de Pagamentos: {aluno.nome}</h3>
                    <button onClick={onClose} style={styles.closeButton}>X</button>
                </div>

                {/* Corpo (Lista e Formulário) */}
                <div style={styles.body}>
                    
                    {/* Lista de Pagamentos Registados */}
                    <div style={styles.section}>
                        <h4>Pagamentos Registados</h4>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Vencimento</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Data Pagamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.length > 0 && historico.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.dataVencimento}</td>
                                        <td>{formatarBRL(p.valor)}</td>
                                        <td style={{ color: p.status === 'PAGO' ? 'green' : 'red' }}>
                                            {p.status}
                                        </td>
                                        <td>{p.dataPagamento || "---"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {mensagem && <p style={{ textAlign: 'center' }}>{mensagem}</p>}
                    </div>

                    {/* Formulário para Novo Pagamento */}
                    <div style={styles.section}>
                        <h4>Registar Novo Pagamento</h4>
                        <div style={styles.form}>
                            <input
                                type="number"
                                name="valor"
                                placeholder="Valor (R$)"
                                value={novoPagamento.valor}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                type="date"
                                name="dataVencimento"
                                value={novoPagamento.dataVencimento}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <select
                                name="status"
                                value={novoPagamento.status}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="PENDENTE">Pendente</option>
                                <option value="PAGO">Pago</option>
                                <option value="ATRASADO">Atrasado</option>
                            </select>
                            <button onClick={handleSalvarPagamento} style={styles.buttonSalvar}>Registar</button>
                        </div>
                    </div>
                </div>

                {/* Rodapé (com o botão de PDF) */}
                <div style={styles.footer}>
                    <button onClick={gerarPDF} style={styles.buttonPdf}>
                        Gerar Relatório PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

// Estilos CSS embutidos para simplicidade
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#fff',
        width: '800px',
        maxWidth: '90%',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        background: 'transparent', border: 'none', fontSize: '1.5rem',
        cursor: 'pointer', color: '#888',
    },
    body: {
        padding: '20px',
        maxHeight: '70vh',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    section: {
        padding: '15px',
        border: '1px solid #f0f0f0',
        borderRadius: '5px'
    },
    table: {
        width: '100%', borderCollapse: 'collapse',
    },
    form: {
        display: 'flex', flexDirection: 'column', gap: '10px'
    },
    input: {
        padding: '10px', fontSize: '15px',
        border: '1px solid #ccc', borderRadius: '5px'
    },
    buttonSalvar: {
        padding: '10px', fontSize: '15px', color: '#fff',
        backgroundColor: '#f39c12', border: 'none', borderRadius: '5px', cursor: 'pointer'
    },
    footer: {
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        textAlign: 'right',
    },
    buttonPdf: {
        padding: '10px 20px', fontSize: '15px', color: '#fff',
        backgroundColor: '#e74c3c', border: 'none', borderRadius: '5px', cursor: 'pointer'
    }
};