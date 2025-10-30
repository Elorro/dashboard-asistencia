import "styled-components";

export const theme = {
  colors: {
    // Marca SIOMA
    primary: "#B00020", // rojo principal
    primaryLight: "#c23b4b", // rojo más claro
    primaryDark: "#7a0015", // rojo profundo, para hover o énfasis

    card: "#ffffff",
    red: "#C62828",
    darkRed: "#8E0000",

    // Texto
    text: "#333333", // texto principal
    textLight: "#ffffff", // texto sobre fondos oscuros/claro intenso
    textSecondary: "#666666", // texto menos importante / subtítulos

    // Fondos / superficies
    background: "#f5f6fa", // fondo general de la app (dashboard)
    backgroundAlt: "#f4f5f7", // fondo alterno (pantallas auth, secciones)
    surface: "#ffffff", // tarjetas / modales / paneles

    // Bordes / líneas suaves
    borderSoft: "#e0e0e0",
  },

  spacing: (factor: number): string => `${factor * 8}px`,

  borderRadius: "8px",

  shadow: "0 2px 6px rgba(0, 0, 0, 0.1)",

  /* ==========================
     Tipografía del sistema
  ========================== */
  font: {
    family: {
      primary: "'Poppins', 'Segoe UI', sans-serif", // Fuente principal
      secondary: "'Roboto', sans-serif", // Fuente alternativa
    },
    size: {
      xs: "0.75rem", // Pequeño texto auxiliar
      sm: "0.875rem", // Texto normal pequeño
      base: "1rem", // Base (parrafos, formularios)
      lg: "1.25rem", // Subtítulos o títulos pequeños
      xl: "1.5rem", // Títulos medianos
      xxl: "2rem", // Encabezados grandes
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.6,
      relaxed: 1.8,
    },
  },
};

// 👇 Inferimos el tipo del tema automáticamente a partir del objeto
export type ThemeType = typeof theme;

// 👇 Extendemos la definición por defecto de styled-components
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
