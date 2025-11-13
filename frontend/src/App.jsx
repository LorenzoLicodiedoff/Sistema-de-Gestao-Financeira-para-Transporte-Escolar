import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AdminAuthPage from "./pages/AdminAuthPage";
import AlunosResponsaveisPage from "./pages/AlunosResponsaveisPage";
import FuncionariosPage from "./pages/FuncionariosPage";
import VeiculosPage from "./pages/VeiculosPage";
import DespesasPage from "./pages/DespesasPage";
import ReceitasPage from "./pages/ReceitasPage";
import RelatoriosPage from "./pages/RelatoriosPage";

function NavLinks({ admin }) {
  const location = useLocation();
  const links = [
    { to: "/alunos-e-responsaveis", label: "Alunos e Responsáveis" },
    { to: "/funcionarios", label: "Funcionários" },
    { to: "/veiculos", label: "Veículos" },
    { to: "/despesas", label: "Despesas" },
    { to: "/receitas", label: "Receitas" },
    { to: "/relatorios", label: "Relatórios" },
  ];

  if (!admin) return null;

  return (
    <nav className="navegacao">
      <ul>
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <li key={l.to}>
              <Link
                to={l.to}
                className={active ? "nav-link active" : "nav-link"}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function App() {
  const [adminLogado, setAdminLogado] = useState(null);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("adminLogado"));
    if (admin) setAdminLogado(admin);
  }, []);

  const handleLogin = (admin) => {
    setAdminLogado(admin);
    localStorage.setItem("adminLogado", JSON.stringify(admin));
  };

  const handleLogout = () => {
    setAdminLogado(null);
    localStorage.removeItem("adminLogado");
  };

  return (
    <Router>
      <header className="cabecalho">
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Título */}
          <div className="titulo-header">
            SGFTE
          </div>

          {/* Navegação */}
          <NavLinks admin={adminLogado} />

          {/* Perfil */}
          {adminLogado && (
            <div className="perfil-container">
              <div className="perfil-info" onClick={() => document.getElementById("perfil-dropdown").classList.toggle("show")}>
                <div className="perfil-circulo">
                  {adminLogado.nome[0].toUpperCase()}
                </div>
                <span className="perfil-nome">{adminLogado.nome}</span>
              </div>
              <div className="perfil-dropdown" id="perfil-dropdown">
                <p>{adminLogado.nome}</p>
                <p>{adminLogado.email}</p>
                <button onClick={handleLogout}>Sair</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
          <Routes>
            <Route path="/" element={<HomePage admin={adminLogado} onLogout={handleLogout} />} />
            <Route path="/admin/*" element={<AdminAuthPage onLogin={handleLogin} />} />
            <Route
              path="/alunos-e-responsaveis"
              element={adminLogado ? <AlunosResponsaveisPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/funcionarios"
              element={adminLogado ? <FuncionariosPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/veiculos"
              element={adminLogado ? <VeiculosPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/despesas"
              element={adminLogado ? <DespesasPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/receitas"
              element={adminLogado ? <ReceitasPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/relatorios"
              element={adminLogado ? <RelatoriosPage /> : <Navigate to="/admin/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem" }}>
          © {new Date().getFullYear()} SGFTE - Todos os direitos reservados.
        </div>
      </footer>

      <style>{`
        .cabecalho {
          background-color: #fff3e0; /* bege claro */
          padding: 1rem 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .titulo-header {
          margin: 0;
          color: #d97706; /* laranja escuro */
          font-weight: 700;
          font-size: 1.5rem;
        }

        .navegacao ul {
          list-style: none;
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 0;
          margin: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #7c5e3a; /* marrom escuro */
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          transition: 0.3s;
        }

        .nav-link.active,
        .nav-link:hover {
          background-color: #f39c12; /* laranja médio */
          color: #fff; /* texto branco */
        }

        .perfil-container {
          position: relative;
        }

        .perfil-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 8px;
        }

        .perfil-circulo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f39c12; /* laranja */
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
        }

        .perfil-nome {
          font-weight: 600;
          color: #7c5e3a;
        }

        .perfil-dropdown {
          position: absolute;
          right: 0;
          top: 50px;
          background: #f1f5f9;
          color: #333;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          min-width: 180px;
          text-align: left;
          display: none;
          z-index: 1000;
        }

        .perfil-dropdown.show {
          display: block;
        }

        .perfil-dropdown p {
          margin: 0 0 6px 0;
          font-size: 0.9rem;
          color: #7c5e3a;
        }

        .perfil-dropdown button {
          width: 100%;
          padding: 8px;
          background: #ef4444; /* vermelho */
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .perfil-dropdown button:hover {
          background: #dc2626;
        }

        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: #7c5e3a; /* marrom escuro */
          text-align: center;
          padding: 12px 0;
          background-color: #f1f5f9;
        }
      `}</style>
    </Router>
  );
}
