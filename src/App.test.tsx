import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { vi } from "vitest";
import { theme } from "./theme";
import GlobalStyle from "./styles/GlobalStyles";

vi.mock("./store/authStore", () => {
  const mockLogout = vi.fn();
  const mockHydrateProfile = vi.fn();

  const mockedState = {
    user: {
      nombres: "Test",
      apellidos: "User",
      email: "test@example.com",
    },
    accessToken: "fake-token",
    refreshToken: null,
    isLoading: false,
    error: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: mockLogout,
    hydrateProfile: mockHydrateProfile,
    clearError: vi.fn(),
  };

  const useAuthStore = vi.fn(
    (selector?: (state: typeof mockedState) => unknown) =>
      selector ? selector(mockedState) : mockedState
  );

  return { useAuthStore, __mock: { mockLogout, mockHydrateProfile } };
});

vi.mock("./api/asistenciaService", () => {
  const mockedMetrics = {
    totalRegistrados: 12,
    registradosUltimos7: 4,
    registradosUltimos30: 9,
    promedioDiario: 0.3,
    crecimientoSemanal: 25,
    registrosPorDia: [
      { fecha: "2024-01-01", etiqueta: "01/01", registros: 1 },
      { fecha: "2024-01-02", etiqueta: "02/01", registros: 2 },
    ],
    recientes: [
      {
        id: "worker-1",
        nombre: "Persona Demo",
        email: "demo@example.com",
        creado: new Date().toISOString(),
      },
    ],
  };

  return {
    calcularMetricas: vi.fn().mockResolvedValue(mockedMetrics),
    obtenerTrabajadores: vi.fn().mockResolvedValue([]),
    actualizarTrabajador: vi.fn(),
    eliminarTrabajador: vi.fn(),
    registrarDispositivo: vi.fn(),
  };
});

describe("App", () => {
  it("renders the dashboard for an authenticated user", async () => {
    render(
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      await screen.findByRole("heading", { name: /Bienvenido/i })
    ).toHaveTextContent(/Test\s+User/i);

    expect(
      await screen.findByRole("heading", { name: /Panel de contrataciones/i })
    ).toBeInTheDocument();
  });
});
