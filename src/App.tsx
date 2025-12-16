// ================================
// 📁 src/App.tsx
// Aplicación principal con routing y layout persistente
// ================================

import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./components/dashboard";
import WorkerList from "./components/workerList";
import Devices from "./components/devices"; // ✅ Nueva vista

import Login from "./components/sign-in-form/Login";
import Register from "./components/sign-up-form/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import {
  AppContainer,
  MainContent,
  ContentSection,
  ToggleButton,
} from "./AppStyles";

// ✅ Componente principal
const App: React.FC = () => {
  // Estado global del sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Alternar sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Routes>
      {/* 🔓 Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Área protegida — usa layout completo */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppContainer>
              {/* 🧭 Sidebar */}
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

              {/* 🧱 Contenido principal */}
              <MainContent $sidebarOpen={isSidebarOpen}>
                <Header />

                {/* Botón flotante */}
                <ToggleButton
                  $sidebarOpen={isSidebarOpen}
                  onClick={toggleSidebar}
                  type="button"
                >
                  {isSidebarOpen ? "⮜" : "⮞"}
                </ToggleButton>

                <ContentSection>
                  <Dashboard />
                </ContentSection>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        }
      />

      {/* 🧑‍🤝‍🧑 Trabajadores */}
      <Route
        path="/workers"
        element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

              <MainContent $sidebarOpen={isSidebarOpen}>
                <Header />
                <ToggleButton
                  $sidebarOpen={isSidebarOpen}
                  onClick={toggleSidebar}
                  type="button"
                >
                  {isSidebarOpen ? "⮜" : "⮞"}
                </ToggleButton>

                <ContentSection>
                  <WorkerList />
                </ContentSection>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        }
      />

      {/* 📟 Dispositivos */}
      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

              <MainContent $sidebarOpen={isSidebarOpen}>
                <Header />
                <ToggleButton
                  $sidebarOpen={isSidebarOpen}
                  onClick={toggleSidebar}
                  type="button"
                >
                  {isSidebarOpen ? "⮜" : "⮞"}
                </ToggleButton>

                <ContentSection>
                  <Devices />
                </ContentSection>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        }
      />

      {/* 🔁 Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
