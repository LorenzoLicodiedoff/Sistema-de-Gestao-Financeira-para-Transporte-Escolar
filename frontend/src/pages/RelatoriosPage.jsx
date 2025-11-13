import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import api from '../services/api';

// Helper para pegar o primeiro e último dia do mês atual
const getMesAtual = () => {
  const data = new Date();
  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)
    .toISOString().split('T')[0];
  const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0)
    .toISOString().split('T')[0];
  return { primeiroDia, ultimoDia };
};

export default function RelatoriosPage() {
  const { primeiroDia, ultimoDia } = getMesAtual();

  // --- Estados para o Fluxo de Caixa (Req 1) ---
  const [datasFluxo, setDatasFluxo] = useState({
    inicio: primeiroDia,
    fim: ultimoDia,
  });
  const [resultadoFluxo, setResultadoFluxo] = useState(null);
  const [mensagemFluxo, setMensagemFluxo] = useState('');

  // --- Estados para o Faturamento por Veículo (Req 2) ---
  const [veiculos, setVeiculos] = useState([]); // <-- NOVO
  const [filtroVeiculo, setFiltroVeiculo] = useState({ // <-- NOVO
    veiculoId: "",
    inicio: primeiroDia,
    fim: ultimoDia,
  });
  const [resultadoVeiculo, setResultadoVeiculo] = useState(null); // <-- NOVO
  const [mensagemVeiculo, setMensagemVeiculo] = useState(''); // <-- NOVO

  // --- Carregar Veículos para o Dropdown ---
  useEffect(() => {
    api.get('/veiculos')
      .then(response => {
        setVeiculos(response.data);
        // Se houver veículos, pré-seleciona o primeiro
        if (response.data.length > 0) {
          setFiltroVeiculo(prev => ({ ...prev, veiculoId: response.data[0].id }));
        }
      })
      .catch(error => {
        console.error("Erro ao buscar veículos:", error);
        setMensagemVeiculo("Erro ao carregar veículos.");
      });
  }, []); // Roda uma vez

  
  // --- Lógica do Fluxo de Caixa (Req 1) ---
  const buscarRelatorioFluxo = () => {
    setMensagemFluxo('Carregando...');
    setResultadoFluxo(null);

    api.get('/relatorios/fluxo-caixa', {
      params: {
        inicio: datasFluxo.inicio,
        fim: datasFluxo.fim,
      },
    })
    .then(response => {
      setResultadoFluxo(response.data);
      setMensagemFluxo('');
    })
    .catch(error => {
      console.error('Erro ao buscar relatório de fluxo:', error);
      setMensagemFluxo('Erro ao buscar dados. Verifique o console.');
    });
  };

  const handleChangeFluxo = (e) => {
    setDatasFluxo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  
  // --- Lógica do Faturamento por Veículo (Req 2) ---
  const buscarRelatorioVeiculo = () => {
    if (!filtroVeiculo.veiculoId) {
      setMensagemVeiculo("Por favor, selecione um veículo.");
      return;
    }
    setMensagemVeiculo('Carregando...');
    setResultadoVeiculo(null);

    api.get('/relatorios/faturamento-veiculo', {
      params: {
        veiculoId: filtroVeiculo.veiculoId,
        inicio: filtroVeiculo.inicio,
        fim: filtroVeiculo.fim,
      },
    })
    .then(response => {
      setResultadoVeiculo(response.data);
      setMensagemVeiculo('');
    })
    .catch(error => {
      console.error('Erro ao buscar faturamento do veículo:', error);
      setMensagemVeiculo('Erro ao buscar dados. Verifique o console.');
    });
  };

  const handleChangeVeiculo = (e) => {
    setFiltroVeiculo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  // Helper para formatar BRL (R$)
  const formatarBRL = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="pagina">
      {/* CSS Atualizado */}
      <style>{`
        .pagina { padding: 40px; font-family: "Segoe UI", sans-serif; max-width: 1000px; margin: 40px auto; background-color: #f1f5f9; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        h2, h3 { color: #e67e22; text-align: center; margin-bottom: 20px; }
        
        /* Layout de 2 colunas para os relatórios */
        .relatorios-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        @media (max-width: 800px) { .relatorios-grid { grid-template-columns: 1fr; } }
        
        .relatorio-card {
          background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .filtro-container { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .filtro-container div { display: flex; justify-content: space-between; align-items: center; }
        .filtro-container label { font-weight: 600; font-size: 0.9rem; }
        .filtro-container input, .filtro-container select { padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 15px; width: 65%; }
        .filtro-container button { padding: 12px 20px; border: none; border-radius: 6px; background-color: #f39c12; color: white; font-size: 15px; cursor: pointer; font-weight: 600; margin-top: 10px; }
        
        .resultado-container { text-align: center; }
        .resultado-item { margin: 15px 0; font-size: 1.1rem; }
        .resultado-item span { font-weight: 600; }
        .saldo-positivo { color: green; font-size: 1.4rem; font-weight: bold; }
        .saldo-negativo { color: red; font-size: 1.4rem; font-weight: bold; }
      `}</style>
      
      <h2>Relatórios Financeiros</h2>

      <div className="relatorios-grid">

        {/* --- Card 1: Fluxo de Caixa (Req 1) --- */}
        <div className="relatorio-card">
          <h3>Fluxo de Caixa</h3>
          <div className="filtro-container">
            <div>
              <label>De:</label>
              <input type="date" name="inicio" value={datasFluxo.inicio} onChange={handleChangeFluxo} />
            </div>
            <div>
              <label>Até:</label>
              <input type="date" name="fim" value={datasFluxo.fim} onChange={handleChangeFluxo} />
            </div>
            <button onClick={buscarRelatorioFluxo}>Gerar</button>
          </div>

          {mensagemFluxo && <p style={{ textAlign: 'center' }}>{mensagemFluxo}</p>}
          {resultadoFluxo && (
            <div className="resultado-container">
              <div className="resultado-item">
                <span>(+) Total de Receitas:</span> {formatarBRL(resultadoFluxo.totalReceitas)}
              </div>
              <div className="resultado-item">
                <span>(-) Total de Despesas:</span> {formatarBRL(resultadoFluxo.totalDespesas)}
              </div>
              <hr style={{ margin: '20px 0' }} />
              <div className={resultadoFluxo.saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo'}>
                SALDO: {formatarBRL(resultadoFluxo.saldo)}
              </div>
            </div>
          )}
        </div>

        {/* --- Card 2: Faturamento por Veículo (Req 2) --- */}
        <div className="relatorio-card">
          <h3>Faturamento por Veículo</h3>
          <div className="filtro-container">
            <div>
              <label>Veículo:</label>
              <select name="veiculoId" value={filtroVeiculo.veiculoId} onChange={handleChangeVeiculo} style={{ width: '100%' }}>
                <option value="">Selecione um veículo</option>
                {veiculos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.modelo} (Placa: {v.placa})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>De:</label>
              <input type="date" name="inicio" value={filtroVeiculo.inicio} onChange={handleChangeVeiculo} />
            </div>
            <div>
              <label>Até:</label>
              <input type="date" name="fim" value={filtroVeiculo.fim} onChange={handleChangeVeiculo} />
            </div>
            <button onClick={buscarRelatorioVeiculo}>Gerar</button>
          </div>

          {mensagemVeiculo && <p style={{ textAlign: 'center' }}>{mensagemVeiculo}</p>}
          {resultadoVeiculo && (
            <div className="resultado-container">
              <div className="resultado-item saldo-positivo">
                Faturamento do Veículo: {formatarBRL(resultadoVeiculo.totalFaturamentoVeiculo)}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}