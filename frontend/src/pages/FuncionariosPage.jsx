import React, { useState } from "react";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    cargo: "",
    telefone: "",
    ativo: true,
  });
  const [indexEdicao, setIndexEdicao] = useState(null);

  const salvarFuncionario = () => {
    if (!novoFuncionario.nome || !novoFuncionario.cargo) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const listaAtualizada = [...funcionarios];
    if (indexEdicao !== null) {
      listaAtualizada[indexEdicao] = novoFuncionario;
      setIndexEdicao(null);
    } else {
      listaAtualizada.push(novoFuncionario);
    }

    setFuncionarios(listaAtualizada);
    setNovoFuncionario({ nome: "", cargo: "", telefone: "", ativo: true });
  };

  const editarFuncionario = (index) => {
    setNovoFuncionario(funcionarios[index]);
    setIndexEdicao(index);
  };

  const excluirFuncionario = (index) => {
    if (window.confirm("Deseja realmente excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((_, i) => i !== index));
    }
  };

  const alternarAtivo = (index) => {
    const lista = [...funcionarios];
    lista[index].ativo = !lista[index].ativo;
    setFuncionarios(lista);
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
        .lista-funcionarios {
          width: 80%;
          margin: 0 auto;
          border-collapse: collapse;
        }
        .lista-funcionarios th, .lista-funcionarios td {
          border-bottom: 1px solid #ddd;
          padding: 10px;
          color: black; /* Dados em preto */
        }
        .lista-funcionarios th {
          background-color: #ffe9d0;
        }
        .ativo {
          background-color: #fffdf8;
          font-weight: bold;
        }
        .inativo {
          background-color: #f7e2d5;
          font-weight: bold;
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

      <h2>Cadastro de Funcionários</h2>

      <table className="form-tabela">
        <tbody>
          <tr>
            <td>Nome:</td>
            <td>
              <input
                type="text"
                value={novoFuncionario.nome}
                onChange={(e) => {
                  let valor = e.target.value;

                  // Remove tudo que não for letra ou espaço
                  valor = valor.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

                  // Remove espaços extras no início
                  valor = valor.replace(/^\s+/, "");

                  setNovoFuncionario({ ...novoFuncionario, nome: valor });
                }}
                placeholder="Nome completo"
                maxLength="60"
              />
            </td>
          </tr>
          <tr>
            <td>Cargo:</td>
            <td>
              <input
                type="text"
                value={novoFuncionario.cargo}
                onChange={(e) =>
                  setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })
                }
                placeholder="Cargo do funcionário"
              />
            </td>
          </tr>
          <tr>
            <td>Telefone:</td>
            <td>
              <input
                type="text"
                value={novoFuncionario.telefone}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
                  if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

                  // Formatação automática: (11) 99999-8888
                  if (valor.length > 6) {
                    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
                  } else if (valor.length > 2) {
                    valor = valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
                  } else {
                    valor = valor.replace(/^(\d*)/, "($1");
                  }

                  setNovoFuncionario({ ...novoFuncionario, telefone: valor });
                }}
                placeholder="Telefone (com DDD)"
                maxLength="15"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={salvarFuncionario}>
                {indexEdicao !== null ? "Salvar Alterações" : "Cadastrar Funcionário"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Lista de Funcionários</h3>
      {funcionarios.length === 0 ? (
        <p class="mensagem-vazia">Nenhum funcionário cadastrado.</p>
      ) : (
        <table className="lista-funcionarios">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((f, index) => (
              <tr key={index} className={f.ativo ? "ativo" : "inativo"}>
                <td>{f.nome}</td>
                <td>{f.cargo}</td>
                <td>{f.telefone || "-"}</td>
                <td style={{ color: f.ativo ? "green" : "red", fontWeight: "bold" }}>
                  {f.ativo ? "Ativo" : "Inativo"}
                </td>
                <td>
                  <button onClick={() => editarFuncionario(index)} className="botao-acao editar">
                    Editar
                  </button>
                  <button onClick={() => alternarAtivo(index)} className="botao-acao status">
                    {f.ativo ? "Inativar" : "Ativar"}
                  </button>
                  <button onClick={() => excluirFuncionario(index)} className="botao-acao excluir">
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
