// ============================
// 📁 src/components/sidebar/SidebarStyles.ts
// Estilos para la barra lateral adaptable
// ============================

import styled from "styled-components";

/* ============================
   Tipos
============================ */
interface SidebarContainerProps {
  sidebarOpen: boolean;
}

interface OverlayProps {
  visible: boolean;
}

/* ============================
   Contenedor principal (Sidebar)
============================ */
export const SidebarContainer = styled.aside<SidebarContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing(3)};

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);

  /* Animación suave al abrir/cerrar */
  transform: translateX(${({ sidebarOpen }) => (sidebarOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  z-index: 1000;

  @media (max-width: 768px) {
    width: 220px;
    z-index: 1200;
  }
`;

/* ============================
   Logo
============================ */
export const LogoImg = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  filter: brightness(95%);
`;

/* ============================
   Título
============================ */
export const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
`;

/* ============================
   Menú principal
============================ */
export const Menu = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  text-align: center;
`;

export const MenuItem = styled.li`
  margin: ${({ theme }) => theme.spacing(1)} 0;

  a {
    color: ${({ theme }) => theme.colors.textLight};
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: ${({ theme }) => theme.spacing(1)} 0;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
`;

/* ============================
   Overlay (fondo oscuro móvil)
============================ */
export const Overlay = styled.div<OverlayProps>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 900;

  @media (min-width: 769px) {
    display: none;
  }
`;

/* ============================
   Botón toggle (☰ / ✕)
   *Este se usa solo si lo manejas dentro del sidebar
   *(Actualmente está en App.tsx)
============================ */
export const ToggleButton = styled.button`
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 2000;

  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  font-size: 1.4rem;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
    font-size: 1.3rem;
  }
`;
