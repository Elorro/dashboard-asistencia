import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
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
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrateProfile = useAuthStore((state) => state.hydrateProfile);

  useEffect(() => {
    if (accessToken && !user) {
      void hydrateProfile();
    }
  }, [accessToken, user, hydrateProfile]);

  if (!accessToken) {
    // Si no hay sesión → redirige al login
    return <Navigate to="/login" replace />;
  }

  if (isLoading && !user) {
    return <div>Cargando sesión...</div>;
  }

  // Si hay usuario → muestra el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
