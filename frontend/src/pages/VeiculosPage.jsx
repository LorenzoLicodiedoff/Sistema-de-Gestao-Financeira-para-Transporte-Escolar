import React, { useState } from "react";

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [novo, setNovo] = useState({
    modelo: "",
    placa: "",
    capacidade: "",
    ano: "",
    ativo: true,
  });
  const [editando, setEditando] = useState(null);

  const limparCampos = () => {
    setNovo({ modelo: "", placa: "", capacidade: "", ano: "", ativo: true });
    setEditando(null);
  };

  const salvarVeiculo = () => {
    if (!novo.modelo || !novo.placa || !novo.ano) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (editando !== null) {
      const atualizados = veiculos.map((v, i) => (i === editando ? novo : v));
      setVeiculos(atualizados);
    } else {
      setVeiculos([...veiculos, novo]);
    }
    limparCampos();
  };

  const editarVeiculo = (index) => {
    setNovo(veiculos[index]);
    setEditando(index);
  };

  const alternarStatus = (index) => {
    const atualizados = veiculos.map((v, i) =>
      i === index ? { ...v, ativo: !v.ativo } : v
    );
    setVeiculos(atualizados);
  };

  const excluirVeiculo = (index) => {
    if (window.confirm("Deseja realmente excluir este veículo?")) {
      setVeiculos(veiculos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="pagina">
      <style>{`
        .pagina {
          padding: 40px;
          text-align: center;
          font-family: "Segoe UI", sans-serif;
          background-color: #f1f5f9;
          color: #333;
        }
        h2 {
          color: #e67e22;
          margin-bottom: 20px;
        }
        .form-tabela {
          margin: 0 auto;
          border-collapse: collapse;
          width: 60%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .form-tabela td {
          padding: 15px;
          text-align: left;
        }
        input {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        button {
          background-color: #f39c12;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: 0.3s;
          margin: 2px;
        }
        button:hover {
          background-color: #e67e22;
        }
        .lista-veiculos {
          width: 80%;
          margin: 0 auto;
          border-collapse: collapse;
        }
        .lista-veiculos th, .lista-veiculos td {
          border-bottom: 1px solid #ddd;
          padding: 10px;
        }
        .lista-veiculos th {
          background-color: #ffe9d0;
        }
        .ativo {
          background-color: #fffdf8;
        }
        .inativo {
          background-color: #f7e2d5;
          color: #999;
        }
        .botao-acao {
          border: none;
          border-radius: 6px;
          cursor: pointer;
          padding: 8px 12px;
          margin: 0 4px;
          font-size: 14px;
          transition: 0.3s;
        }
        .botao-acao.editar {
          background-color: #3498db;
          color: white;
        }
        .botao-acao.status {
          background-color: #f39c12;
          color: white;
        }
        .botao-acao.excluir {
          background-color: #e74c3c;
          color: white;
        }
        .botao-acao:hover {
          opacity: 0.85;
        }
        .mensagem-vazia {
          color: #666;
          font-size: 18px;
          margin-top: 25px;
          font-style: italic;
        }
      `}</style>

      <h2>Cadastro de Veículos</h2>

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
                onChange={(e) => setNovo({ ...novo, placa: e.target.value })}
                placeholder="Placa do veículo"
              />
            </td>
          </tr>
          <tr>
            <td>Capacidade:</td>
            <td>
              <input
                type="number"
                min="1"
                step="1"
                value={novo.capacidade}
                onChange={(e) =>
                  setNovo({ ...novo, capacidade: e.target.value })
                }
                placeholder="Capacidade de passageiros"
              />
            </td>
          </tr>
          <tr>
            <td>Ano:</td>
            <td>
              <input
                type="number"
                min="1"
                step="1"
                value={novo.ano}
                onChange={(e) => setNovo({ ...novo, ano: e.target.value })}
                placeholder="Ano de fabricação"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={salvarVeiculo}>
                {editando !== null ? "Atualizar Veículo" : "Salvar Veículo"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Lista de Veículos</h3>

      {veiculos.length === 0 ? (
        <p class="mensagem-vazia">Nenhum veículo cadastrado.</p>
      ) : (
        <table className="lista-veiculos">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Capacidade</th>
              <th>Ano</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v, i) => (
              <tr key={i} className={v.ativo ? "ativo" : "inativo"}>
                <td>{v.modelo}</td>
                <td>{v.placa}</td>
                <td>{v.capacidade || "-"}</td>
                <td>{v.ano}</td>
                <td style={{ color: v.ativo ? "green" : "red" }}>
                  {v.ativo ? "Ativo" : "Inativo"}
                </td>
                <td>
                  <button
                    onClick={() => editarVeiculo(i)}
                    className="botao-acao editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => alternarStatus(i)}
                    className="botao-acao status"
                  >
                    {v.ativo ? "Inativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => excluirVeiculo(i)}
                    className="botao-acao excluir"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
