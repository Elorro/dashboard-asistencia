import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

// ===========================================
// 🔹 Tipado de las props
// ===========================================
interface ProtectedRouteProps {
  children: ReactNode;
}

// ===========================================
// 🔹 Componente funcional protegido
// ===========================================
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario autenticado → redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario → muestra el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
