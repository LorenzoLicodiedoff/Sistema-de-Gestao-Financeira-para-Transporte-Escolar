import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

export default function AdminAuthPage({ onLogin }) {
  return (
    <Routes>
      <Route path="login" element={<LoginForm onLogin={onLogin} />} />
      <Route path="cadastro" element={<CadastroForm onLogin={onLogin} />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cadastrado = JSON.parse(localStorage.getItem("admin"));
    if (cadastrado && cadastrado.email === email && cadastrado.senha === senha) {
      alert("Login realizado!");
      onLogin(cadastrado);
      navigate("/alunos-e-responsaveis");
    } else {
      alert("Email ou senha incorretos!");
    }
  };

  return (
    <AuthCard
      titulo="Login de Administrador"
      botaoTexto="Entrar"
      onSubmit={handleSubmit}
      alternarTexto="Ainda não tem conta?"
      alternarAcao={() => navigate("/admin/cadastro")}
      children={
        <>
          <Campo label="Email" type="email" value={email} onChange={setEmail} placeholder="Digite seu email" />
          <Campo label="Senha" type="password" value={senha} onChange={setSenha} placeholder="Digite sua senha" />
        </>
      }
    />
  );
}

function CadastroForm({ onLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return alert("Preencha todos os campos!");
    const admin = { nome, email, senha };
    localStorage.setItem("admin", JSON.stringify(admin));
    alert("Cadastro realizado!");
    onLogin(admin);
    navigate("/alunos-e-responsaveis");
  };

  return (
    <AuthCard
      titulo="Cadastro de Administrador"
      botaoTexto="Cadastrar"
      onSubmit={handleSubmit}
      alternarTexto="Já tem conta?"
      alternarAcao={() => navigate("/admin/login")}
      children={
        <>
          <Campo label="Nome completo" type="text" value={nome} onChange={setNome} placeholder="Digite seu nome completo" />
          <Campo label="Email" type="email" value={email} onChange={setEmail} placeholder="Digite seu email" />
          <Campo label="Senha" type="password" value={senha} onChange={setSenha} placeholder="Digite sua senha" />
        </>
      }
    />
  );
}
function Campo({ label, type, value, onChange, placeholder }) {
  return (
    <div className="campo">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

function AuthCard({ titulo, botaoTexto, onSubmit, alternarTexto, alternarAcao, children }) {
  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h2>{titulo}</h2>
        <form onSubmit={onSubmit} className="auth-form">
          {children}
          <button type="submit" className="botao-principal">{botaoTexto}</button>
        </form>
        <p className="alternar-modo">
          {alternarTexto}{" "}
          <button onClick={alternarAcao} className="link">
            {alternarTexto.includes("não") ? "Cadastrar" : "Login"}
          </button>
        </p>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f1f5f9;
          font-family: "Segoe UI", sans-serif;
        }
        .auth-card {
          background-color: #ffffff; 
          padding: 40px 50px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          text-align: center;
          width: 400px;
          animation: fadeInUp 0.8s ease;
        }
        .auth-card h2 {
          color: #e67e22; 
          margin-bottom: 20px;
          font-size: 1.8rem;
        }
        .auth-form {
          text-align: left;
        }
        .campo {
          margin-bottom: 18px;
        }
        .campo label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #333;
        }
        .campo input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: 0.3s;
        }
        .campo input:focus {
          border-color: #f39c12;
          box-shadow: 0 0 5px rgba(243, 156, 18, 0.3);
          outline: none;
        }
        .botao-principal {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background-color: #f39c12; 
          color: white;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .botao-principal:hover {
          background-color: #e67e22;
        }
        .alternar-modo {
          margin-top: 18px;
          color: #333;
          text-align: center;
        }
        .link {
          border: none;
          background: none;
          color: #f39c12;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
          font-size: 15px;
        }
        .fade-in {
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
