import React, { useState } from "react";

export default function AlunosResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState([]);
  const [novoResponsavel, setNovoResponsavel] = useState({
    nome: "",
    telefone: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cep: "",
    alunos: [],
  });
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    instituicao: "",
    serie: "",
    nivelEscolaridade: "",
    nivelOutro: "",
    ativo: true,
  });
  const [indexEdicao, setIndexEdicao] = useState(null);
  const [adicionandoAluno, setAdicionandoAluno] = useState(false);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);

  // --- Funções de Responsável ---
  const salvarResponsavel = () => {
    const { nome, telefone, logradouro, numero, bairro, cep } = novoResponsavel;
    if (!nome || !telefone || !logradouro || !numero || !bairro || !cep) {
      alert("Preencha todos os campos do responsável!");
      return;
    }

    if (indexEdicao !== null) {
      const listaAtualizada = [...responsaveis];
      listaAtualizada[indexEdicao] = novoResponsavel;
      setResponsaveis(listaAtualizada);
      setIndexEdicao(null);
    } else {
      setResponsaveis([...responsaveis, novoResponsavel]);
    }

    setNovoResponsavel({
      nome: "",
      telefone: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cep: "",
      alunos: [],
    });
  };

  const editarResponsavel = (index) => {
    setNovoResponsavel(responsaveis[index]);
    setIndexEdicao(index);
  };

  const excluirResponsavel = (index) => {
    if (window.confirm("Deseja realmente excluir este responsável?")) {
      setResponsaveis(responsaveis.filter((_, i) => i !== index));
    }
  };

  const abrirFormularioAluno = (responsavelIndex) => {
    setResponsavelSelecionado(responsavelIndex);
    setNovoAluno({
      nome: "",
      instituicao: "",
      serie: "",
      nivelEscolaridade: "",
      nivelOutro: "",
      ativo: true,
    });
    setAdicionandoAluno(true);
  };

  // --- Funções de Aluno ---
  const salvarAluno = () => {
    const { nome, instituicao, serie, nivelEscolaridade } = novoAluno;
    if (!nome || !instituicao || !serie || !nivelEscolaridade) {
      alert("Preencha todos os campos do aluno!");
      return;
    }

    const lista = [...responsaveis];
    lista[responsavelSelecionado].alunos.push(novoAluno);
    setResponsaveis(lista);
    setAdicionandoAluno(false);
  };

  const alternarAtivo = (responsavelIndex, alunoIndex) => {
    const lista = [...responsaveis];
    lista[responsavelIndex].alunos[alunoIndex].ativo =
      !lista[responsavelIndex].alunos[alunoIndex].ativo;
    setResponsaveis(lista);
  };

  const editarAluno = (responsavelIndex, alunoIndex) => {
    const aluno = responsaveis[responsavelIndex].alunos[alunoIndex];
    const nome = prompt("Novo nome do aluno:", aluno.nome) || aluno.nome;
    const instituicao = prompt("Nova instituição:", aluno.instituicao) || aluno.instituicao;
    const serie = prompt("Nova série:", aluno.serie) || aluno.serie;

    const lista = [...responsaveis];
    lista[responsavelIndex].alunos[alunoIndex] = { ...aluno, nome, instituicao, serie };
    setResponsaveis(lista);
  };

  const excluirAluno = (responsavelIndex, alunoIndex) => {
    if (window.confirm("Deseja realmente excluir este aluno?")) {
      const lista = [...responsaveis];
      lista[responsavelIndex].alunos.splice(alunoIndex, 1);
      setResponsaveis(lista);
    }
  };

  // --- Função para montar endereço com quebra de linha ---
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
      `}</style>

      {/* Formulário Responsável */}
      <h2>Cadastrar Responsável</h2>
      <table className="form-tabela">
        <tbody>
          <tr>
            <td>Nome:</td>
            <td>
              <input
                type="text"
                value={novoResponsavel.nome}
                onChange={(e) => {
                  let valor = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                  valor = valor.replace(/^\s+/, "");
                  setNovoResponsavel({ ...novoResponsavel, nome: valor });
                }}
                placeholder="Nome completo"
                maxLength="60"
              />
            </td>
          </tr>
          <tr>
            <td>Telefone:</td>
            <td>
              <input
                type="text"
                value={novoResponsavel.telefone}
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
                placeholder="Telefone (com DDD)"
                maxLength="15"
              />
            </td>
          </tr>

          {/* Endereço */}
          <tr>
            <td>Logradouro:</td>
            <td>
              <input
                type="text"
                value={novoResponsavel.logradouro}
                onChange={(e) => setNovoResponsavel({ ...novoResponsavel, logradouro: e.target.value })}
                placeholder="Logradouro de residência"
              />
            </td>
          </tr>
          <tr>
            <td>Número:</td>
            <td>
              <input
                type="text"
                value={novoResponsavel.numero}
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
              <input
                type="text"
                value={novoResponsavel.bairro}
                onChange={(e) => setNovoResponsavel({ ...novoResponsavel, bairro: e.target.value })}
                placeholder="Bairro de residência"
              />
            </td>
          </tr>
          <tr>
            <td>CEP:</td>
            <td>
              <input
                type="text"
                value={novoResponsavel.cep}
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
                {indexEdicao !== null ? "Salvar Alterações" : "Cadastrar Responsável"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Formulário Aluno */}
      {adicionandoAluno && (
        <div className="form-aluno">
          <h3>Adicionar Aluno</h3>
          <table className="form-tabela">
            <tbody>
              <tr>
                <td>Nome:</td>
                <td>
                  <input
                    type="text"
                    value={novoAluno.nome}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                      valor = valor.replace(/^\s+/, "");
                      setNovoAluno({ ...novoAluno, nome: valor });
                    }}
                    placeholder="Nome completo"
                    maxLength="60"
                  />
                </td>
              </tr>
              <tr>
                <td>Instituição:</td>
                <td>
                  <input
                    type="text"
                    value={novoAluno.instituicao}
                    onChange={(e) =>
                      setNovoAluno({ ...novoAluno, instituicao: e.target.value })
                    }
                    placeholder="Instituição de ensino"
                  />
                </td>
              </tr>
              <tr>
                <td>Série:</td>
                <td>
                  <input
                    type="text"
                    value={novoAluno.serie}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, "");
                      valor = valor.replace(/^0+/, "");
                      setNovoAluno({ ...novoAluno, serie: valor });
                    }}
                    placeholder="Série"
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
                    <input
                      type="text"
                      value={novoAluno.nivelOutro}
                      onChange={(e) => setNovoAluno({ ...novoAluno, nivelOutro: e.target.value })}
                      placeholder="Detalhar nível"
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  <button onClick={salvarAluno} className="botao-acao status">Salvar Aluno</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Lista */}
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
            {responsaveis.map((r, index) => (
              <tr key={index}>
                <td>{r.nome}</td>
                <td>{r.telefone}</td>
                <td>{montarEndereco(r)}</td>
                <td>
                  <button onClick={() => abrirFormularioAluno(index)} className="botao-acao status">Adicionar Aluno</button>
                  <button onClick={() => editarResponsavel(index)} className="botao-acao editar">Editar</button>
                  <button onClick={() => excluirResponsavel(index)} className="botao-acao excluir">Excluir</button>
                </td>
                <td>
                  {r.alunos.length > 0 && (
                    <table className="alunos-tabela">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Instituição</th>
                          <th>Série</th>
                          <th>Nível de Escolaridade</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.alunos.map((aluno, aIndex) => (
                          <tr key={aIndex}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.instituicao}</td>
                            <td>{aluno.serie}</td>
                            <td>{aluno.nivelEscolaridade === "Outro" ? aluno.nivelOutro : aluno.nivelEscolaridade}</td>
                            <td style={{ color: aluno.ativo ? "green" : "red", fontWeight: "bold" }}>
                              {aluno.ativo ? "Ativo" : "Inativo"}
                            </td>
                            <td>
                              <button onClick={() => editarAluno(index, aIndex)} className="botao-acao editar">Editar</button>
                              <button onClick={() => alternarAtivo(index, aIndex)} className="botao-acao status">
                                {aluno.ativo ? "Inativar" : "Ativar"}
                              </button>
                              <button onClick={() => excluirAluno(index, aIndex)} className="botao-acao excluir">Excluir</button>
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
    </div>
  );
}
