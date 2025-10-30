import React from "react";
import styled from "styled-components";
import logo from "../../assets/Lnombre.svg"; // ✅ Usa el logo correcto

// ====== Tipado de props ======
interface LogoProps {
  showText?: boolean;
}

// ====== Estilos ======
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Img = styled.img`
  height: 40px;
  width: auto;
`;

const Text = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-family: ${({ theme }) => theme.font.family.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.font.size.xl};
`;

// ====== Componente principal ======
const Logo: React.FC<LogoProps> = ({ showText = true }) => (
  <LogoContainer>
    <Img src={logo} alt="Logo SIOMA" />
    {showText && <Text>SIOMA</Text>}
  </LogoContainer>
);

export default Logo;
