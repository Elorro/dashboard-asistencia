import React from "react";
import styled from "styled-components";
// ✅ Importamos el SVG como componente React
import Logo from "../assets/Lnombre.svg?react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

// ==================== 🎨 ESTILOS ====================
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundAlt || "#f4f5f7"};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface || "#fff"};
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 380px;
  text-align: center;

  @media (max-width: 420px) {
    width: 90%;
    padding: 30px 25px;
  }
`;

// ✅ Logo SVG con color dinámico desde el tema
const StyledLogo = styled(Logo)`
  width: 180px;
  height: auto;
  fill: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;

  @media (max-width: 420px) {
    width: 150px;
  }
`;

const FooterText = styled.p`
  margin-top: 25px;
  color: ${({ theme }) => theme.colors.textSecondary || "#666"};
  font-size: 0.85rem;
`;

// ==================== ⚛️ COMPONENTE ====================
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Container>
      {/* ✅ Logo SVG renderizado dinámicamente */}
      <StyledLogo title="Logo SIOMA" />

      <Card>{children}</Card>

      <FooterText>
        © {new Date().getFullYear()} SIOMA — Todos los derechos reservados
      </FooterText>
    </Container>
  );
};

export default AuthLayout;
