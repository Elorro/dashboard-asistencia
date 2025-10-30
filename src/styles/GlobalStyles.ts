// src/styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

/**
 * Estilos globales para toda la aplicación.
 * Integra tipado del tema definido en theme.ts.
 */
const GlobalStyle = createGlobalStyle`
  /* Reset y tipografía base */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.font.family.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.font.lineHeight.normal};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    opacity: 0.85;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  button:active {
    transform: scale(0.98);
  }

  /* Scroll personalizado (opcional) */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default GlobalStyle;
