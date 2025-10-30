// ================================
// Punto de entrada principal de la app React con Vite
// ================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { AuthProvider } from "./context/AuthContext";
import { theme } from "./theme";
import GlobalStyle from "./styles/GlobalStyles";
import App from "./App";
import "./index.css";

// ✅ 1. Obtener el elemento raíz del DOM donde React montará la aplicación
const rootElement = document.getElementById("root") as HTMLElement;

// ✅ 2. Crear la raíz del árbol de React (React 18+)
const root = ReactDOM.createRoot(rootElement);

// ✅ 3. Renderizar la aplicación completa dentro del proveedor de contexto, tema y router
root.render(
  <React.StrictMode>
    {/* Proveedor global de estilos y tema */}
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      {/* Enrutamiento con React Router */}
      <BrowserRouter>
        {/* Proveedor de autenticación (maneja login, logout y sesión global) */}
        <AuthProvider>
          {/* Componente principal de la aplicación */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
