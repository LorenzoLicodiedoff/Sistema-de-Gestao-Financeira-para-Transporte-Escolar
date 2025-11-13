import React, { useState, useEffect } from "react";
import api from '../services/api';

export default function VeiculosPage() {

  // --- Estados ---
  const [veiculos, setVeiculos] = useState([]);
  
  // 1. ESTADO 'NOVO' ATUALIZADO
  const [novo, setNovo] = useState({
    modelo: "",
    placa: "",
    anoFabricacao: "",
    dataVencimentoLicenca: "", // Adicionado
    dataVencimentoSeguro: ""  // Adicionado
  });
  
  const [mensagem, setMensagem] = useState('');

  const buscarVeiculos = () => {
    api.get('/veiculos')
      .then(response => {
        setVeiculos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar veículos:", error);
        setMensagem("Erro ao carregar lista de veículos.");
      });
  };

  // useEffect: Roda UMA VEZ quando a página carrega
  useEffect(() => {
    buscarVeiculos();
  }, []); // O array vazio [] garante que só roda na "montagem"

  
  // 2. 'LIMPARCAMPOS' ATUALIZADO
  const limparCampos = () => {
    setNovo({
      modelo: "",
      placa: "",
      anoFabricacao: "",
      dataVencimentoLicenca: "",
      dataVencimentoSeguro: ""
    });
    // setEditando(null);
  };

  // 3. 'SALVARVEICULO' ATUALIZADO
  const salvarVeiculo = () => {
    if (!novo.modelo || !novo.placa || !novo.anoFabricacao) {
      alert("Preencha todos os campos obrigatórios (Modelo, Placa, Ano)!");
      return;
    }

    // Objeto que o backend (Spring) espera (com os campos novos)
    // Enviamos null se a data estiver vazia, o backend (LocalDate) aceita isso.
    const veiculoParaSalvar = {
      modelo: novo.modelo,
      placa: novo.placa,
      anoFabricacao: parseInt(novo.anoFabricacao),
      dataVencimentoLicenca: novo.dataVencimentoLicenca || null,
      dataVencimentoSeguro: novo.dataVencimentoSeguro || null
    };

    api.post('/veiculos', veiculoParaSalvar)
      .then(response => {
        setMensagem('Veículo salvo com sucesso!');
        limparCampos();
        buscarVeiculos(); // Atualiza a lista com os dados do banco
      })
      .catch(error => {
        console.error("Erro ao salvar:", error);
        setMensagem('Erro ao salvar veículo. Verifique a consola.');
      });
  };

  return (
    <div className="pagina">
      {/* O seu CSS original é mantido */}
      <style>{`
        .pagina {
          padding: 40px;
          font-family: "Segoe UI", sans-serif;
          max-width: 1000px;
          margin: 40px auto;
          background-color: #f1f5f9;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        h2,
        h3 {
          color: #e67e22;
          text-align: center;
          margin-bottom: 30px;
        }
        .form-tabela,
        .lista-veiculos {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }
        .form-tabela td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        .form-tabela td:first-child {
          font-weight: 600;
          color: #333;
          width: 120px;
          background-color: #fdfdfd;
        }
        .form-tabela input,
        .form-tabela select {
          width: 95%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 15px;
        }
        .form-tabela button {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          background-color: #f39c12;
          color: white;
          font-size: 15px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .form-tabela button:hover {
          background-color: #e67e22;
        }
        .mensagem-vazia {
          text-align: center;
          color: #555;
          font-style: italic;
          padding: 20px;
        }
        .lista-veiculos th,
        .lista-veiculos td {
          padding: 14px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .lista-veiculos th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #333;
        }
        .lista-veiculos tr:hover {
          background-color: #fdfdfd;
        }
        /* Estilos dos botões de ação (mantidos caso precise no futuro) */
        .botao-acao {
          padding: 6px 10px;
          margin-right: 6px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: 0.2s;
        }
        .botao-acao.editar {
          background-color: #3498db;
          color: white;
        }
        .botao-acao.editar:hover {
          background-color: #2980b9;
        }
        .botao-acao.status {
          background-color: #f1c40f;
          color: #333;
        }
        .botao-acao.status:hover {
          background-color: #f39c12;
        }
        .botao-acao.excluir {
          background-color: #e74c3c;
          color: white;
        }
        .botao-acao.excluir:hover {
          background-color: #c0392b;
        }
      `}</style>

      <h2>Cadastro de Veículos</h2>

      {/* --- 4. FORMULÁRIO ATUALIZADO --- */}
      <table className="form-tabela">
        <tbody>
          <tr>
            <td>Modelo:</td>
            <td>
              <input
                value={novo.modelo}
                onChange={(e) => setNovo({ ...novo, modelo: e.target.value })}
                placeholder="Modelo do veículo"
              />
            </td>
          </tr>
          <tr>
            <td>Placa:</td>
            <td>
              <input
                value={novo.placa}
                onChange={(e) => setNovo({ ...novo, placa: e.target.value.toUpperCase() })}
                placeholder="Placa do veículo"
              />
            </td>
          </tr>
          <tr>
            <td>Ano:</td>
            <td>
              <input
                type="number"
                min="1990"
                step="1"
                value={novo.anoFabricacao}
                onChange={(e) =>
                  setNovo({ ...novo, anoFabricacao: e.target.value })
                }
                placeholder="Ano de fabricação"
              />
            </td>
          </tr>

          {/* --- INÍCIO DA SEÇÃO ADICIONADA --- */}
          <tr>
            <td>Venc. Licença:</td>
            <td>
              <input
                type="date"
                value={novo.dataVencimentoLicenca}
                onChange={(e) =>
                  setNovo({ ...novo, dataVencimentoLicenca: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td>Venc. Seguro:</td>
            <td>
              <input
                type="date"
                value={novo.dataVencimentoSeguro}
                onChange={(e) =>
                  setNovo({ ...novo, dataVencimentoSeguro: e.target.value })
                }
              />
            </td>
          </tr>
          {/* --- FIM DA SEÇÃO ADICIONADA --- */}
          
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={salvarVeiculo}>Salvar Novo Veículo</button>
              {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red', marginTop: '10px' }}>{mensagem}</p>}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Lista de Veículos (Vindos do Servidor)</h3>

      {veiculos.length === 0 ? (
        <p className="mensagem-vazia">Nenhum veículo cadastrado na base de dados.</p>
      ) : (
        <table className="lista-veiculos">
          
          {/* --- 5. CABEÇALHO DA LISTA ATUALIZADO --- */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Ano</th>
              <th>Venc. Licença</th>
              <th>Venc. Seguro</th>
            </tr>
          </thead>

          {/* --- 6. CORPO DA LISTA ATUALIZADO (com lógica de alerta) --- */}
          <tbody>
            {veiculos.map((v) => {

              // --- LÓGICA DE ALERTA ADICIONADA ---
              // new Date() sem nada pega a data/hora de AGORA
              const hoje = new Date(); 
              // Garante que a data existe E se ela é anterior a hoje
              const licencaVencida = v.dataVencimentoLicenca && (new Date(v.dataVencimentoLicenca) < hoje);
              const seguroVencido = v.dataVencimentoSeguro && (new Date(v.dataVencimentoSeguro) < hoje);

              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.modelo}</td>
                  <td>{v.placa}</td>
                  <td>{v.anoFabricacao}</td>
                  
                  {/* --- CÉLULAS ADICIONADAS --- */}
                  <td style={{ color: licencaVencida ? 'red' : 'inherit', fontWeight: licencaVencida ? 'bold' : 'normal' }}>
                    {/* Mostra N/A se a data for nula, senão mostra a data */}
                    {v.dataVencimentoLicenca || "N/A"}
                    {/* Mostra o ⚠️ se estiver vencido */}
                    {licencaVencida && " ⚠️"}
                  </td>
                  <td style={{ color: seguroVencido ? 'red' : 'inherit', fontWeight: seguroVencido ? 'bold' : 'normal' }}>
                    {v.dataVencimentoSeguro || "N/A"}
                    {seguroVencido && " ⚠️"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}