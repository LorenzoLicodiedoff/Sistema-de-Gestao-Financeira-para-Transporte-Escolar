import React, { useState, useEffect } from "react";
import api from '../services/api'; // Nosso conector de API
import HistoricoPagamentosModal from "./HistoricoPagamentosModal";

export default function AlunosResponsaveisPage() {
  
  // --- ESTADOS ---
  const [responsaveis, setResponsaveis] = useState([]); 
  
  const [novoResponsavel, setNovoResponsavel] = useState({
    nome: "", telefone: "", logradouro: "", numero: "", bairro: "", cep: "",
  });
  const [idEdicao, setIdEdicao] = useState(null); 

  const [novoAluno, setNovoAluno] = useState({
    nome: "", instituicao: "", serie: "", nivelEscolaridade: "", nivelOutro: "", ativo: true,
  });
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null); 
  const [idEdicaoAluno, setIdEdicaoAluno] = useState(null); 
  const [alunoParaHistorico, setAlunoParaHistorico] = useState(null);


  // --- FUNÇÃO PRINCIPAL: Buscar todos os dados do backend ---
  const buscarResponsaveis = () => {
    api.get('/responsaveis') 
      .then(response => {
        setResponsaveis(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar responsáveis:", error);
        alert("Erro ao carregar dados. O backend está rodando?");
      });
  };

  // --- useEffect: Roda UMA VEZ quando a página carrega ---
  useEffect(() => {
    buscarResponsaveis(); 
  }, []); 


  // --- Limpar Formulários ---
  const limparFormResponsavel = () => {
    setNovoResponsavel({ nome: "", telefone: "", logradouro: "", numero: "", bairro: "", cep: "" });
    setIdEdicao(null);
  };
  const limparFormAluno = () => {
    setNovoAluno({ nome: "", instituicao: "", serie: "", nivelEscolaridade: "", nivelOutro: "", ativo: true });
    setIdEdicaoAluno(null);
    setResponsavelSelecionado(null);
  };

  
  // --- Funções de Responsável (com API) ---
  
  const salvarResponsavel = () => {
    const { nome, telefone, logradouro, numero, bairro, cep } = novoResponsavel;
    if (!nome || !telefone || !logradouro || !numero || !bairro || !cep) {
      alert("Preencha todos os campos do responsável!");
      return;
    }

    const promessa = idEdicao
      ? api.put(`/responsaveis/${idEdicao}`, novoResponsavel) // ATUALIZAR (PUT)
      : api.post('/responsaveis', novoResponsavel);          // CRIAR (POST)

    promessa
      .then(response => {
        alert(idEdicao ? "Responsável atualizado!" : "Responsável cadastrado!");
        limparFormResponsavel();
        buscarResponsaveis(); 
      })
      .catch(error => {
        console.error("Erro ao salvar responsável:", error);
        alert("Erro ao salvar. Verifique o console.");
      });
  };

  const editarResponsavel = (responsavel) => {
    setNovoResponsavel({
      nome: responsavel.nome,
      telefone: responsavel.telefone,
      logradouro: responsavel.logradouro,
      numero: responsavel.numero,
      bairro: responsavel.bairro,
      cep: responsavel.cep,
    });
    setIdEdicao(responsavel.id); 
    window.scrollTo(0, 0); 
  };

  const excluirResponsavel = (id) => {
    if (window.confirm("Deseja realmente excluir este responsável? (Todos os alunos dele serão excluídos!)")) {
      api.delete(`/responsaveis/${id}`) // EXCLUIR (DELETE)
        .then(() => {
          alert("Responsável excluído.");
          buscarResponsaveis(); 
        })
        .catch(error => {
          console.error("Erro ao excluir:", error);
          alert("Erro ao excluir. O responsável pode ter alunos associados.");
        });
    }
  };


  // --- Funções de Aluno (com API) ---

  const abrirFormularioAluno = (responsavelId) => {
    setResponsavelSelecionado(responsavelId); 
    setNovoAluno({ nome: "", instituicao: "", serie: "", nivelEscolaridade: "", nivelOutro: "", ativo: true });
    setIdEdicaoAluno(null);
  };

  const salvarAluno = () => {
    const { nome, instituicao, serie, nivelEscolaridade } = novoAluno;
    if (!nome || !instituicao || !serie || !nivelEscolaridade) {
      alert("Preencha todos os campos do aluno!");
      return;
    }

    const alunoParaSalvar = {
      ...novoAluno,
      responsavel: { id: responsavelSelecionado } 
    };

    const promessa = idEdicaoAluno
      ? api.put(`/alunos/${idEdicaoAluno}`, alunoParaSalvar) // ATUALIZAR (PUT)
      : api.post('/alunos', alunoParaSalvar);                 // CRIAR (POST)
    
    promessa
      .then(() => {
        alert(idEdicaoAluno ? "Aluno atualizado!" : "Aluno salvo!");
        limparFormAluno();
        buscarResponsaveis(); 
      })
      .catch(error => {
        console.error("Erro ao salvar aluno:", error);
        alert("Erro ao salvar aluno. Verifique o console.");
      });
  };

  const editarAluno = (aluno, responsavelId) => {
    setNovoAluno({
      nome: aluno.nome,
      instituicao: aluno.instituicao,
      serie: aluno.serie,
      nivelEscolaridade: aluno.nivelEscolaridade,
      nivelOutro: aluno.nivelOutro || "",
      ativo: aluno.ativo,
    });
    setIdEdicaoAluno(aluno.id); 
    setResponsavelSelecionado(responsavelId); // Usa o ID do pai vindo da lista
    window.scrollTo(0, document.getElementById('form-aluno').offsetTop);
  };

  const alternarAtivo = (aluno) => {
    // Pega o ID do responsável (que não vem no objeto aluno por causa do JsonBackReference)
    // Então, buscamos o ID pelo 'find' na lista principal
    const resp = responsaveis.find(r => r.alunos.some(a => a.id === aluno.id));
    
    const alunoAtualizado = { 
      ...aluno, 
      ativo: !aluno.ativo,
      responsavel: { id: resp.id } // Adiciona o responsável para o PUT
    };
    
    api.put(`/alunos/${aluno.id}`, alunoAtualizado)
      .then(() => {
        buscarResponsaveis(); 
      })
      .catch(error => console.error("Erro ao alternar status", error));
  };

  const excluirAluno = (id) => {
    if (window.confirm("Deseja realmente excluir este aluno?")) {
      api.delete(`/alunos/${id}`) // EXCLUIR (DELETE)
        .then(() => {
          alert("Aluno excluído.");
          buscarResponsaveis(); 
        })
        .catch(error => {
          console.error("Erro ao excluir:", error);
          alert("Erro ao excluir aluno.");
        });
    }
  };


  // --- Função para montar endereço (sem mudanças) ---
  const montarEndereco = (r) => (
    <>
      {r.logradouro}, {r.numero}<br />
      {r.bairro}<br />
      CEP: {r.cep}
    </>
  );

  return (
    <div className="pagina">
      <style>{`
        .pagina { padding: 40px; text-align: center; font-family: "Segoe UI", sans-serif; background-color: #f1f5f9; color: #333; }
        h2, h3 { color: #e67e22; }
        .form-tabela { margin: 0 auto; border-collapse: collapse; width: 60%; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .form-tabela td { padding: 15px; text-align: left; }
        input, select { width: 100%; padding: 12px; font-size: 15px; border-radius: 8px; border: 1px solid #ccc; }
        button { cursor: pointer; font-size: 14px; transition: 0.3s; margin: 2px; padding: 8px 12px; border: none; border-radius: 6px; }
        .botao-acao.editar { background-color: #3498db; color: white; }
        .botao-acao.status { background-color: #f39c12; color: white; }
        .botao-acao.excluir { background-color: #e74c3c; color: white; }
        .botao-acao:hover { opacity: 0.85; }
        .mensagem-vazia { color: #666; font-size: 18px; margin-top: 25px; font-style: italic; }
        .lista-responsaveis { width: 90%; margin: 0 auto; border-collapse: collapse; }
        .lista-responsaveis th, .lista-responsaveis td { border-bottom: 1px solid #ddd; padding: 10px; text-align: center; color: black; vertical-align: top; }
        .alunos-tabela { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .alunos-tabela th, .alunos-tabela td { border: 1px solid #ccc; padding: 6px; font-size: 14px; color: black; }
        .alunos-tabela th { background-color: #ffe9d0; }
        .botao-cancelar { background-color: #7f8c8d; color: white; }
      `}</style>

      {/* --- Formulário Responsável (COM MÁSCARAS) --- */}
      <h2>{idEdicao ? "Editando Responsável" : "Cadastrar Responsável"}</h2>
      <table className="form-tabela">
        <tbody>
          <tr>
            <td>Nome:</td>
            <td>
              <input type="text" value={novoResponsavel.nome}
                onChange={(e) => {
                  let valor = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                  valor = valor.replace(/^\s+/, "");
                  setNovoResponsavel({ ...novoResponsavel, nome: valor });
                }}
                placeholder="Nome completo" maxLength="60"
              />
            </td>
          </tr>
          <tr>
            <td>Telefone:</td>
            <td>
              <input type="text" value={novoResponsavel.telefone}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  if (valor.length > 11) valor = valor.slice(0, 11);
                  if (valor.length > 6) {
                    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
                  } else if (valor.length > 2) {
                    valor = valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
                  } else {
                    valor = valor.replace(/^(\d*)/, "($1");
                  }
                  setNovoResponsavel({ ...novoResponsavel, telefone: valor });
                }}
                placeholder="Telefone (com DDD)" maxLength="15"
              />
            </td>
          </tr>
          <tr>
            <td>Logradouro:</td>
            <td>
              <input type="text" value={novoResponsavel.logradouro}
                // Logradouro pode ter números (ex: Rua 15), então não removemos
                onChange={(e) => setNovoResponsavel({ ...novoResponsavel, logradouro: e.target.value })}
                placeholder="Logradouro de residência"
              />
            </td>
          </tr>
          <tr>
            <td>Número:</td>
            <td>
              <input type="text" value={novoResponsavel.numero}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  valor = valor.replace(/^0+/, "");
                  setNovoResponsavel({ ...novoResponsavel, numero: valor });
                }}
                placeholder="Número de residência"
              />
            </td>
          </tr>
          <tr>
            <td>Bairro:</td>
            <td>
              <input type="text" value={novoResponsavel.bairro}
                onChange={(e) => {
                  // Bairro geralmente não tem números, como solicitado
                  let valor = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                  valor = valor.replace(/^\s+/, "");
                  setNovoResponsavel({ ...novoResponsavel, bairro: valor });
                }}
                placeholder="Bairro de residência"
              />
            </td>
          </tr>
          <tr>
            <td>CEP:</td>
            <td>
              <input type="text" value={novoResponsavel.cep}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  if (valor.length > 8) valor = valor.slice(0, 8);
                  if (valor.length > 5) {
                    valor = valor.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
                  }
                  setNovoResponsavel({ ...novoResponsavel, cep: valor });
                }}
                placeholder="00000-000"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={salvarResponsavel} className="botao-acao status">
                {idEdicao !== null ? "Salvar Alterações" : "Cadastrar Responsável"}
              </button>
              {idEdicao !== null && (
                <button onClick={limparFormResponsavel} className="botao-cancelar">
                  Cancelar Edição
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- Formulário Aluno (COM MÁSCARAS) --- */}
      <div className="form-aluno" id="form-aluno"> 
        {(responsavelSelecionado || idEdicaoAluno) && ( 
          <>
            <h3>{idEdicaoAluno ? "Editando Aluno" : "Adicionar Aluno"}</h3>
            <table className="form-tabela">
              <tbody>
                <tr>
                  <td>Nome:</td>
                  <td>
                    <input type="text" value={novoAluno.nome}
                      onChange={(e) => {
                        let valor = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                        valor = valor.replace(/^\s+/, "");
                        setNovoAluno({ ...novoAluno, nome: valor });
                      }}
                      placeholder="Nome completo" maxLength="60"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Instituição:</td>
                  <td>
                    <input type="text" value={novoAluno.instituicao}
                      onChange={(e) => setNovoAluno({ ...novoAluno, instituicao: e.target.value })}
                      placeholder="Instituição de ensino"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Série:</td>
                  <td>
                    <input type="text" value={novoAluno.serie}
                      onChange={(e) => {
                        let valor = e.target.value.replace(/\D/g, "");
                        valor = valor.replace(/^0+/, "");
                        setNovoAluno({ ...novoAluno, serie: valor });
                      }}
                      placeholder="Série (só números)"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Nível de escolaridade:</td>
                  <td>
                    <select
                      value={novoAluno.nivelEscolaridade}
                      onChange={(e) => setNovoAluno({ ...novoAluno, nivelEscolaridade: e.target.value })}
                    >
                      <option value="">Selecione</option>
                      <option value="Educação Infantil">Educação Infantil</option>
                      <option value="Ensino Fundamental">Ensino Fundamental</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </td>
                </tr>
                {novoAluno.nivelEscolaridade === "Outro" && (
                  <tr>
                    <td>Detalhar:</td>
                    <td>
                      <input type="text" value={novoAluno.nivelOutro}
                        onChange={(e) => setNovoAluno({ ...novoAluno, nivelOutro: e.target.value })}
                        placeholder="Detalhar nível"
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    <button onClick={salvarAluno} className="botao-acao status">
                      {idEdicaoAluno ? "Salvar Alterações" : "Salvar Aluno"}
                    </button>
                    <button onClick={limparFormAluno} className="botao-cancelar">
                      Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* --- Lista de Responsáveis e Alunos (Vindos da API) --- */}
      <h3>Lista de Responsáveis e Alunos</h3>
      {responsaveis.length === 0 ? (
        <p className="mensagem-vazia">Nenhum responsável ou aluno cadastrado.</p>
      ) : (
        <table className="lista-responsaveis">
          <thead>
            <tr>
              <th>Nome do Responsável</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações para Responsável</th>
              <th>Alunos</th>
            </tr>
          </thead>
          <tbody>
            {responsaveis.map((r) => (
              <tr key={r.id}>
                <td>{r.nome}</td>
                <td>{r.telefone}</td>
                <td>{montarEndereco(r)}</td>
                <td>
                  <button onClick={() => abrirFormularioAluno(r.id)} className="botao-acao status">Adicionar Aluno</button>
                  <button onClick={() => editarResponsavel(r)} className="botao-acao editar">Editar</button>
                  <button onClick={() => excluirResponsavel(r.id)} className="botao-acao excluir">Excluir</button>
                </td>
                <td>
                  {r.alunos && r.alunos.length > 0 && (
                    <table className="alunos-tabela">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Instituição</th>
                          <th>Série</th>
                          <th>Nível</th>
                          <th>Status</th>
                          <th>Ações</th>
                          <th>Pagamentos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.alunos.map((aluno) => (
                          <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.instituicao}</td>
                            <td>{aluno.serie}</td>
                            <td>{aluno.nivelEscolaridade === "Outro" ? aluno.nivelOutro : aluno.nivelEscolaridade}</td>
                            <td style={{ color: aluno.ativo ? "green" : "red", fontWeight: "bold" }}>
                              {aluno.ativo ? "Ativo" : "Inativo"}
                            </td>
                            <td>
                              <button onClick={() => editarAluno(aluno, r.id)} className="botao-acao editar">Editar</button>
                              <button onClick={() => alternarAtivo(aluno)} className="botao-acao status">
                                {aluno.ativo ? "Inativar" : "Ativar"}
                              </button>
                              <button onClick={() => excluirAluno(aluno.id)} className="botao-acao excluir">Excluir</button>
                              <td>
                          <button 
                            onClick={() => setAlunoParaHistorico(aluno)}
                            className="botao-acao editar" // Reusa o estilo azul
                          >
                            Ver/Registar
                          </button>
                        </td>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {alunoParaHistorico && (
    <HistoricoPagamentosModal
      aluno={alunoParaHistorico}
      onClose={() => setAlunoParaHistorico(null)}
    />
  )}
    </div>
  );
}