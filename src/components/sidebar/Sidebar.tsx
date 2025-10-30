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
} from "./SidebarStyles";
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
  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.innerWidth <= 768
  );

  useEffect(() => {
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
      <SidebarContainer sidebarOpen={isOpen}>
        <LogoImg src={logo} alt="Logo SIOMA" />
        <Title>Panel de Control</Title>

        <Menu>
          <MenuItem>
            <a href="#metrics" onClick={handleNavigate}>
              Métricas
            </a>
          </MenuItem>
          <MenuItem>
            <a href="#grafico" onClick={handleNavigate}>
              Asistencias
            </a>
          </MenuItem>
        </Menu>
      </SidebarContainer>

      {/* ============================
          Overlay solo visible en móvil
      ============================ */}
      <Overlay visible={isMobile && isOpen} onClick={toggleSidebar} />
    </>
  );
};

export default Sidebar;
