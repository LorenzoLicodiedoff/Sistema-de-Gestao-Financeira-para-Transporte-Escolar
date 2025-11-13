import React, { useState, useEffect } from "react";
import api from '../services/api';

export default function ReceitasPage() {

  const [veiculos, setVeiculos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [novaReceita, setNovaReceita] = useState({
    veiculoId: "", // Guardará o ID do veículo selecionado (opcional)
    valor: "",
    data: new Date().toISOString().split('T')[0], // Data de hoje
    descricao: ""
  });

  // 1. Buscar veículos para preencher o dropdown (opcional)
  const buscarVeiculos = () => {
    api.get('/veiculos')
      .then(response => {
        setVeiculos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar veículos:", error);
        setMensagem("Aviso: Não foi possível carregar os veículos para associação.");
      });
  };

  // 2. useEffect: Roda UMA VEZ para buscar os veículos
  useEffect(() => {
    buscarVeiculos();
  }, []);

  // 3. Handler para submeter a Receita
  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem('');

    if (!novaReceita.valor || !novaReceita.data) {
      setMensagem("Erro: Preencha Valor e Data.");
      return;
    }

    const receitaParaSalvar = {
      valor: parseFloat(novaReceita.valor),
      data: novaReceita.data,
      descricao: novaReceita.descricao,
      // Se um veículo foi selecionado, envia o objeto de ID
      // Se não (veiculoId === ""), envia null
      veiculo: novaReceita.veiculoId ? { id: parseInt(novaReceita.veiculoId) } : null
    };

    api.post('/receitas', receitaParaSalvar)
      .then(response => {
        setMensagem("Receita registada com sucesso!");
        // Limpa (reset) o formulário
        setNovaReceita(prev => ({
          ...prev,
          veiculoId: "", // Reseta o veículo
          valor: "",
          descricao: "",
          data: new Date().toISOString().split('T')[0]
        }));
      })
      .catch(error => {
        console.error("Erro ao salvar receita:", error);
        setMensagem("Erro ao salvar. Verifique a consola.");
      });
  };

  // 4. Handler para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaReceita(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="pagina">
      {/* Reutilizando o CSS da DespesasPage */}
      <style>{`
        .pagina { padding: 40px; font-family: "Segoe UI", sans-serif; max-width: 1000px; margin: 40px auto; background-color: #f1f5f9; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        h2, h3 { color: #e67e22; text-align: center; margin-bottom: 30px; }
        .form-tabela { width: 70%; margin: 0 auto; border-collapse: collapse; margin-bottom: 30px; background-color: white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden; }
        .form-tabela td { padding: 12px 15px; border-bottom: 1px solid #eee; }
        .form-tabela td:first-child { font-weight: 600; color: #333; width: 150px; background-color: #fdfdfd; }
        .form-tabela input, .form-tabela select, .form-tabela textarea { width: 95%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 15px; }
        .form-tabela button { padding: 12px 20px; border: none; border-radius: 6px; background-color: #f39c12; color: white; font-size: 15px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .form-tabela button:hover { background-color: #e67e22; }
      `}</style>

      <h2>Módulo Financeiro – Receitas</h2>

      <form onSubmit={handleSubmit}>
        <table className="form-tabela">
          <thead>
            <tr><th colSpan="2" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb' }}><h3>Registar Faturamento</h3></th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Valor (R$):</td>
              <td>
                <input type="number" name="valor" min="0.01" step="0.01" value={novaReceita.valor} onChange={handleChange} required placeholder="Ex: 350.00" />
              </td>
            </tr>
            <tr>
              <td>Data:</td>
              <td>
                <input type="date" name="data" value={novaReceita.data} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td>Veículo:</td>
              <td>
                <select name="veiculoId" value={novaReceita.veiculoId} onChange={handleChange}>
                  <option value="">[Receita Geral / Não associada]</option>
                  {veiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.modelo} (Placa: {v.placa})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Descrição:</td>
              <td>
                <textarea name="descricao" value={novaReceita.descricao} onChange={handleChange} placeholder="(Opcional) Ex: Pagamento mensal Aluno X" />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button type="submit">Registar Receita</button>
                {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red', marginTop: '10px' }}>{mensagem}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* (Opcional) Aqui poderíamos adicionar uma lista de receitas já registadas */}
      
    </div>
  );
}