import styled from "styled-components";

/* ==========================
   Contenedor general
========================== */
export const DashboardContainer = styled.div<{ sidebarAbierta?: boolean }>`
  padding: 20px;
  transition: margin-left 0.3s ease;

  ${({ sidebarAbierta }) =>
    sidebarAbierta &&
    `
      margin-left: 250px;
    `}
`;

/* ==========================
   Título principal
========================== */
export const DashboardTitle = styled.h2`
  margin-bottom: 25px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 1.8rem;
  font-weight: 600;
`;

/* ==========================
   Tarjetas de métricas
========================== */
export const MetricCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

/* ==========================
   Contenedor del gráfico
========================== */
export const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};

  h3 {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

/* ==========================
   Estado de carga / error
========================== */
export const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  margin-top: 40px;
`;
