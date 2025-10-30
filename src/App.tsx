// ================================
// 📁 src/App.tsx
// Componente principal de la aplicación (enrutamiento y estructura base)
// ================================

import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Dashboard from "./components/dashboard/Dashboard";
import WorkerList from "./components/workerList/WorkerList";
import Login from "./components/sign-in-form/Login";
import Register from "./components/sign-up-form/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import {
  AppContainer,
  MainContent,
  ContentSection,
  ToggleButton,
} from "./AppStyles"; // 🎨 Estilos del layout (ver más abajo)


// ✅ Componente principal
const App: React.FC = () => {
  // Estado para controlar si la Sidebar está abierta o cerrada
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Alterna visibilidad de la Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  console.log("✅ App.tsx se está renderizando");

  return (
    <>
      {/* 🧭 Definición de rutas */}
      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Ruta protegida principal */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppContainer>
                {/* 🧭 Sidebar con toggle */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* 🧱 Contenido principal dinámico */}
                <MainContent sidebarOpen={isSidebarOpen}>
                  <Header />

                  {/* Botón flotante para mostrar/ocultar la Sidebar */}
                  <ToggleButton onClick={toggleSidebar}>
                    {isSidebarOpen ? "⮜" : "⮞"}
                  </ToggleButton>

                  <ContentSection>
                    <Dashboard />
                    <div style={{ marginTop: "40px" }}>
                      <WorkerList />
                    </div>
                  </ContentSection>
                </MainContent>
              </AppContainer>
            </ProtectedRoute>
          }
        />

        {/* 🔁 Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
