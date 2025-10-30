import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.3s ease;
`;

/* ============================
   Contenido principal dinámico
============================ */
export const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  transition: margin-left 0.3s ease, width 0.3s ease;
  padding: 20px;

  /* ✅ Cuando la sidebar está visible */
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "250px" : "0")};
  width: ${({ sidebarOpen }) => (sidebarOpen ? "calc(100% - 250px)" : "100%")};

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

/* ============================
   Sección del contenido
============================ */
export const ContentSection = styled.section`
  margin-top: 20px;
`;

/* ============================
   Botón flotante de toggle
============================ */
export const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  z-index: 2000;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (min-width: 769px) {
    left: ${({ theme }) => theme.spacing(2)};
  }
`;
