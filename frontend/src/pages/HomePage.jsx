import React from "react";

export default function HomePage({ admin }) {
  return (
    <div className="home-container fade-in">
      <div className="home-card">
        {!admin ? (
          <>
            <h1>Bem-vindo ao SGFTE</h1>
            <p>
              Sistema de Gestão de Frotas e Transporte Escolar.<br />
              Faça login como administrador para gerenciar responsáveis, alunos,
              veículos e motoristas.
            </p>
            <a
              href="/admin/login"
              className="home-btn"
            >
              Entrar como Administrador
            </a>
          </>
        ) : (
          <>
            {/* Página vazia após login do administrador */}
          </>
        )}
      </div>

      <style>{`
        .home-container {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Segoe UI", sans-serif;
          background-color: #f1f5f9;
        }
        .home-card {
          background-color: #ffffff; /* card branco */
          border-radius: 12px;
          padding: 40px 50px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          width: 500px;
          max-width: 90%;
          text-align: center;
          animation: fadeInUp 0.8s ease;
        }
        .home-card h1 {
          font-size: 28px;
          font-weight: 700;
          color: #e67e22; /* título laranja */
          margin-bottom: 12px;
        }
        .home-card p {
          font-size: 16px;
          color: #333; /* texto escuro */
          margin-bottom: 24px;
        }
        .home-btn {
          width: 100%;
          padding: 14px 0;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
          background-color: #f39c12; /* botão laranja */
          color: white;             /* texto branco */
          text-decoration: none;    /* remove sublinhado */
          display: inline-block;
        }

        .home-btn:hover {
          background-color: #e67e22; /* hover laranja escuro */
          color: white;              /* mantém o texto branco */
          text-decoration: none;     /* mantém sem sublinhado */
        }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .fade-in { 
          animation: fadeIn 0.8s ease; 
        }
        @keyframes fadeIn { 
          from { opacity: 0; transform: scale(0.98); } 
          to { opacity: 1; transform: scale(1); } 
        }

      `}</style>
    </div>
  );
}
