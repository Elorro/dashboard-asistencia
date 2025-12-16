import styled from "styled-components";

/* ==========================
   Contenedor general
========================== */
export const DashboardContainer = styled.div<{ $sidebarAbierta?: boolean }>`
  padding: 20px;
  transition: margin-left 0.3s ease;

  ${({ $sidebarAbierta }) =>
    $sidebarAbierta &&
    `
      margin-left: 250px;
    `}

  @media (max-width: 768px) {
    padding: 16px;
  }
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
  margin-bottom: 32px;
`;

export const GrowthBadge = styled.span<{ $positive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#2e7d32" : "#c62828")};
`;

/* ==========================
   Layout de visualizaciones
========================== */
export const InsightsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
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
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/* ==========================
   Registrados recientes
========================== */
export const RecentContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};

  h3 {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export const RecentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RecentItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSoft};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  strong {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  margin-top: 40px;
`;
