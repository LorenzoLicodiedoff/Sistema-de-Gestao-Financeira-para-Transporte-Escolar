import React, { useState, useEffect } from "react";
import api from '../services/api'; 

const CATEGORIAS_DESPESA = [
  "COMBUSTIVEL",
  "MANUTENCAO_PREVENTIVA",
  "MANUTENCAO_CORRETIVA",
  "IMPOSTOS",
  "SEGURO",
  "LIMPEZA",
  "OUTROS"
];

export default function DespesasPage() {
  
  const [veiculos, setVeiculos] = useState([]); // Lista de veículos para o dropdown
  const [mensagemManual, setMensagemManual] = useState('');
  const [mensagemFixa, setMensagemFixa] = useState('');

  // Estado para o formulário de Despesa Manual
  const [novaDespesa, setNovaDespesa] = useState({
    veiculoId: "", // Guardará o ID do veículo selecionado
    categoria: CATEGORIAS_DESPESA[0],
    valor: "",
    data: new Date().toISOString().split('T')[0], // Data de hoje
    descricao: ""
  });

  // Estado para o formulário de Despesa Fixa
  const [novaDespesaFixa, setNovaDespesaFixa] = useState({
    veiculoId: "",
    categoria: CATEGORIAS_DESPESA[0],
    valor: "",
    diaDoMesRegistro: "5", // Dia padrão
    descricao: ""
  });

  // --- Funções da API ---

  // 1. Buscar veículos para preencher os dropdowns
  const buscarVeiculos = () => {
    api.get('/veiculos')
      .then(response => {
        setVeiculos(response.data);
        // Se houver veículos, pré-seleciona o primeiro nos formulários
        if (response.data.length > 0) {
          setNovaDespesa(prev => ({ ...prev, veiculoId: response.data[0].id }));
          setNovaDespesaFixa(prev => ({ ...prev, veiculoId: response.data[0].id }));
        }
      })
      .catch(error => {
        console.error("Erro ao buscar veículos:", error);
        setMensagemManual("Erro: Não foi possível carregar os veículos. A página não pode funcionar.");
        setMensagemFixa("Erro: Não foi possível carregar os veículos. A página não pode funcionar.");
      });
  };

  // 2. useEffect: Roda UMA VEZ para buscar os veículos
  useEffect(() => {
    buscarVeiculos();
  }, []);

  // 3. Handler para submeter Despesa MANUAL (Req 1 e 2)
  const handleSubmitManual = (e) => {
    e.preventDefault();
    setMensagemManual('');

    if (!novaDespesa.veiculoId || !novaDespesa.valor || !novaDespesa.data) {
      setMensagemManual("Erro: Preencha Veículo, Valor e Data.");
      return;
    }

    const despesaParaSalvar = {
      categoria: novaDespesa.categoria,
      valor: parseFloat(novaDespesa.valor),
      data: novaDespesa.data,
      descricao: novaDespesa.descricao,
      // O backend espera o objeto Veiculo. 
      // Enviamos apenas o ID e o backend (com a anotação @ManyToOne) 
      // espera que o frontend envie o objeto completo ou que o DTO no backend trate isso.
      // Para simplificar, vamos enviar o ID assim:
      veiculo: { id: parseInt(novaDespesa.veiculoId) }
    };

    api.post('/despesas', despesaParaSalvar)
      .then(response => {
        setMensagemManual("Despesa manual registada com sucesso!");
        // Limpa (reset) o formulário
        setNovaDespesa(prev => ({
          ...prev,
          valor: "",
          descricao: "",
          data: new Date().toISOString().split('T')[0]
        }));
      })
      .catch(error => {
        console.error("Erro ao salvar despesa manual:", error);
        setMensagemManual("Erro ao salvar. Verifique a consola.");
      });
  };

  // 4. Handler para submeter Despesa FIXA (Req 3)
  const handleSubmitFixo = (e) => {
    e.preventDefault();
    setMensagemFixa('');

    if (!novaDespesaFixa.veiculoId || !novaDespesaFixa.valor || !novaDespesaFixa.diaDoMesRegistro) {
      setMensagemFixa("Erro: Preencha Veículo, Valor e Dia do Mês.");
      return;
    }

    const despesaFixaParaSalvar = {
      categoria: novaDespesaFixa.categoria,
      valor: parseFloat(novaDespesaFixa.valor),
      diaDoMesRegistro: parseInt(novaDespesaFixa.diaDoMesRegistro),
      descricao: novaDespesaFixa.descricao,
      veiculo: { id: parseInt(novaDespesaFixa.veiculoId) }
    };
    
    api.post('/despesas/agendar-fixa', despesaFixaParaSalvar)
      .then(response => {
        setMensagemFixa("Despesa fixa agendada com sucesso!");
        // Limpa (reset) o formulário
        setNovaDespesaFixa(prev => ({
          ...prev,
          valor: "",
          descricao: "",
          diaDoMesRegistro: "5"
        }));
      })
      .catch(error => {
        console.error("Erro ao agendar despesa fixa:", error);
        setMensagemFixa("Erro ao agendar. Verifique a consola.");
      });
  };

  // Handlers genéricos para atualizar os estados dos formulários
  const handleChangeManual = (e) => {
    const { name, value } = e.target;
    setNovaDespesa(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeFixo = (e) => {
    const { name, value } = e.target;
    setNovaDespesaFixa(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="pagina">
      {/* O seu CSS (mantido da VeiculosPage) */}
      <style>{`
        .pagina { padding: 40px; font-family: "Segoe UI", sans-serif; max-width: 1000px; margin: 40px auto; background-color: #f1f5f9; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        h2, h3 { color: #e67e22; text-align: center; margin-bottom: 30px; }
        .form-tabela { width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden; }
        .form-tabela td { padding: 12px 15px; border-bottom: 1px solid #eee; }
        .form-tabela td:first-child { font-weight: 600; color: #333; width: 150px; background-color: #fdfdfd; }
        .form-tabela input, .form-tabela select, .form-tabela textarea { width: 95%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 15px; }
        .form-tabela button { padding: 12px 20px; border: none; border-radius: 6px; background-color: #f39c12; color: white; font-size: 15px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .form-tabela button:hover { background-color: #e67e22; }
        .container-formularios { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        @media (max-width: 800px) { .container-formularios { grid-template-columns: 1fr; } }
      `}</style>

      <h2>Módulo Financeiro – Despesas</h2>

      <div className="container-formularios">
        
        {/* --- FORMULÁRIO 1: DESPESA MANUAL (REQ 1 e 2) --- */}
        <form onSubmit={handleSubmitManual}>
          <table className="form-tabela">
            <thead>
              <tr><th colSpan="2" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb' }}><h3>Registar Despesa Manual</h3></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Veículo:</td>
                <td>
                  <select name="veiculoId" value={novaDespesa.veiculoId} onChange={handleChangeManual} required disabled={veiculos.length === 0}>
                    {veiculos.length === 0 ? (
                      <option>Registe um veículo primeiro</option>
                    ) : (
                      veiculos.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.modelo} (Placa: {v.placa})
                        </option>
                      ))
                    )}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Categoria:</td>
                <td>
                  <select name="categoria" value={novaDespesa.categoria} onChange={handleChangeManual} required>
                    {CATEGORIAS_DESPESA.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Valor (R$):</td>
                <td>
                  <input type="number" name="valor" min="0.01" step="0.01" value={novaDespesa.valor} onChange={handleChangeManual} required placeholder="Ex: 150.50" />
                </td>
              </tr>
              <tr>
                <td>Data:</td>
                <td>
                  <input type="date" name="data" value={novaDespesa.data} onChange={handleChangeManual} required />
                </td>
              </tr>
              <tr>
                <td>Descrição:</td>
                <td>
                  <textarea name="descricao" value={novaDespesa.descricao} onChange={handleChangeManual} placeholder="(Opcional) Ex: Troca de óleo" />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  <button type="submit">Registar Despesa</button>
                  {mensagemManual && <p style={{ color: mensagemManual.includes('sucesso') ? 'green' : 'red', marginTop: '10px' }}>{mensagemManual}</p>}
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        {/* --- FORMULÁRIO 2: AGENDAR DESPESA FIXA (REQ 3) --- */}
        <form onSubmit={handleSubmitFixo}>
          <table className="form-tabela">
            <thead>
              <tr><th colSpan="2" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb' }}><h3>Agendar Despesa Fixa</h3></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Veículo:</td>
                <td>
                  <select name="veiculoId" value={novaDespesaFixa.veiculoId} onChange={handleChangeFixo} required disabled={veiculos.length === 0}>
                    {veiculos.length === 0 ? (
                      <option>Registe um veículo primeiro</option>
                    ) : (
                      veiculos.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.modelo} (Placa: {v.placa})
                        </option>
                      ))
                    )}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Categoria:</td>
                <td>
                  <select name="categoria" value={novaDespesaFixa.categoria} onChange={handleChangeFixo} required>
                    {CATEGORIAS_DESPESA.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Valor (R$):</td>
                <td>
                  <input type="number" name="valor" min="0.01" step="0.01" value={novaDespesaFixa.valor} onChange={handleChangeFixo} required placeholder="Ex: 500.00" />
                </td>
              </tr>
              <tr>
                <td>Dia do Mês:</td>
                <td>
                  <input type="number" name="diaDoMesRegistro" min="1" max="31" step="1" value={novaDespesaFixa.diaDoMesRegistro} onChange={handleChangeFixo} required />
                </td>
              </tr>
              <tr>
                <td>Descrição:</td>
                <td>
                  <textarea name="descricao" value={novaDespesaFixa.descricao} onChange={handleChangeFixo} placeholder="(Opcional) Ex: Parcela do Seguro" />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  <button type="submit">Agendar Despesa</button>
                  {mensagemFixa && <p style={{ color: mensagemFixa.includes('sucesso') ? 'green' : 'red', marginTop: '10px' }}>{mensagemFixa}</p>}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* (Opcional) Aqui poderíamos adicionar uma lista de despesas já registadas */}
      
    </div>
  );
}