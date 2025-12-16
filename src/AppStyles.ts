import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? "250px" : "0")};
  transition: margin-left 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const ContentSection = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ToggleButton = styled.button<{ $sidebarOpen: boolean }>`
  position: fixed;
  top: 15px;
  left: ${({ $sidebarOpen }) => ($sidebarOpen ? "270px" : "20px")};
  z-index: 2000;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    left: ${({ $sidebarOpen }) => ($sidebarOpen ? "230px" : "20px")};
  }

  @media (max-width: 768px) {
    left: 15px;
    top: 18px;
  }
`;
