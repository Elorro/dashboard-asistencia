import styled from "styled-components";
import { motion } from "framer-motion";

/* ==========================
   Contenedor general
========================== */
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Poppins", sans-serif;

  /* Fondo con gradiente corporativo */
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 40%,
    ${({ theme }) => theme.colors.surface} 100%
  );
`;

/* ==========================
   Tarjeta de autenticación
========================== */
export const AuthCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 50px 60px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 380px;
  text-align: center;

  @media (max-width: 420px) {
    width: 90%;
    padding: 30px 25px;
  }
`;

/* ==========================
   Logo
========================== */
export const Logo = styled.img`
  width: 140px;
  margin-bottom: 25px;
`;

/* ==========================
   Título principal
========================== */
export const Title = styled.h2`
  margin-bottom: 25px;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
`;

/* ==========================
   Formulario
========================== */
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  input {
    padding: 12px 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.borderSoft};
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 5px rgba(176, 0, 32, 0.3);
  }

  input.error {
    border-color: #e74c3c;
    background-color: #ffeaea;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 600;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

/* ==========================
   Errores
========================== */
export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: -10px;
  text-align: left;
`;

/* ==========================
   Texto de cambio (login/register)
========================== */
export const SwitchText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    text-decoration: underline;
  }
`;
