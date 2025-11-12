import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // URL do backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;// frontend/src/App.jsx (Exemplo simplificado de rotas)

import MensalidadesPage from './pages/MensalidadesPage';
// ... outros imports

function App() {
  return (
    <Router>
        <Header /> {/* Seu componente de Menu/Header */}
        <Routes>
            {/* ... outras rotas ... */}
            <Route path="/mensalidades" element={<MensalidadesPage />} /> 
            {/* ... */}
        </Routes>
    </Router>
  );
}