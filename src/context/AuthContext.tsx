import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// ===========================================
// 🔹 Tipos del usuario y del contexto
// ===========================================

// Estructura del usuario
export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

// Funciones disponibles en el contexto
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (data: User) => void;
  logout: () => void;
}

// ===========================================
// 🔹 Creación del contexto
// ===========================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================================
// 🔹 Proveedor del contexto
// ===========================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Guarda automáticamente los cambios del usuario en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // ===========================================
  // 🔸 Función de inicio de sesión
  // ===========================================
  const login = (email: string, password: string) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("No hay usuarios registrados.");
      return;
    }

    const parsedUser: User = JSON.parse(savedUser);
    if (parsedUser.email === email && parsedUser.password === password) {
      setUser(parsedUser);
      navigate("/");
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  // ===========================================
  // 🔸 Registro de nuevo usuario
  // ===========================================
  const register = (data: User) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/");
  };

  // ===========================================
  // 🔸 Cierre de sesión
  // ===========================================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ===========================================
  // 🔸 Valor compartido del contexto
  // ===========================================
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===========================================
// 🔹 Hook personalizado para acceder al contexto
// ===========================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
