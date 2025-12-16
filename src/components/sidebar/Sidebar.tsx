// ================================
// 📁 src/components/sidebar/Sidebar.tsx
// Barra lateral colapsable (desktop y móvil)
// ================================

import React, { useEffect } from "react";
import {
  SidebarContainer,
  LogoImg,
  Title,
  Menu,
  MenuItem,
  Overlay,
} from "./Sidebar.styles";
import { NavLink } from "react-router-dom";
import logo from "../../assets/sioma.svg";

/* ============================
   Tipado de Props
============================ */
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

/* ============================
   Componente principal
============================ */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = () => {
    // Si se hace clic en un link y estamos en móvil → cierra sidebar
    if (isMobile) toggleSidebar();
  };

  return (
    <>
      {/* ============================
          Sidebar deslizante
      ============================ */}
      <SidebarContainer $sidebarOpen={isOpen}>
        <LogoImg src={logo} alt="Logo SIOMA" />
        <Title>Panel de Control</Title>

        <Menu>
          <MenuItem>
            <NavLink to="/" onClick={handleNavigate}>
              Dashboard
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/workers" onClick={handleNavigate}>
              Trabajadores
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/devices" onClick={handleNavigate}>
              Dispositivos
            </NavLink>
          </MenuItem>
        </Menu>
      </SidebarContainer>

      {/* ============================
          Overlay solo visible en móvil
      ============================ */}
      <Overlay $visible={isMobile && isOpen} onClick={toggleSidebar} />
    </>
  );
};

export default Sidebar;
