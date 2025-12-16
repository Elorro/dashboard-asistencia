import React, { useEffect, useState } from "react";
import {
  calcularMetricas,
  type DashboardMetrics,
} from "../../api/asistenciaService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../card/card";
import {
  DashboardContainer,
  DashboardTitle,
  MetricCards,
  ChartContainer,
  Message,
  InsightsRow,
  RecentContainer,
  RecentList,
  RecentItem,
  GrowthBadge,
} from "./Dashboard.styles";

interface DashboardProps {
  sidebarAbierta?: boolean;
}

const numberFormatter = new Intl.NumberFormat("es-ES");
const percentFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const Dashboard: React.FC<DashboardProps> = ({ sidebarAbierta }) => {
  const [metricas, setMetricas] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarMetricas() {
      try {
        const datos = await calcularMetricas();
        setMetricas(datos);
      } catch (err) {
        console.error("Error cargando métricas:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarMetricas();
  }, []);

  if (loading) return <Message>Cargando métricas...</Message>;
  if (!metricas) return <Message>No se pudieron cargar las métricas.</Message>;

  const crecimientoEsPositivo = metricas.crecimientoSemanal >= 0;
  const crecimientoTexto = `${crecimientoEsPositivo ? "+" : ""}${percentFormatter.format(
    metricas.crecimientoSemanal
  )}%`;

  return (
    <DashboardContainer $sidebarAbierta={sidebarAbierta}>
      <DashboardTitle>Panel de contrataciones</DashboardTitle>

      <MetricCards>
        <Card
          title="Total registrados"
          value={numberFormatter.format(metricas.totalRegistrados)}
        />
        <Card
          title="Alta en los últimos 7 días"
          value={numberFormatter.format(metricas.registradosUltimos7)}
        />
        <Card
          title="Alta en los últimos 30 días"
          value={numberFormatter.format(metricas.registradosUltimos30)}
        />
        <Card
          title="Promedio diario (30 días)"
          value={percentFormatter.format(metricas.promedioDiario)}
        />
      </MetricCards>

      <GrowthBadge $positive={crecimientoEsPositivo}>
        {crecimientoEsPositivo ? "▲" : "▼"} Semana vs. anterior: {crecimientoTexto}
      </GrowthBadge>

      <InsightsRow>
        <ChartContainer>
          <h3>Altas diarias (últimos 30 días)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={metricas.registrosPorDia}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRegistros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B00020" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#B00020" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="etiqueta" stroke="#888" />
              <YAxis allowDecimals={false} stroke="#888" />
              <Tooltip formatter={(value: number) => [`${value} altas`, "Altas"]} />
              <Area
                type="monotone"
                dataKey="registros"
                stroke="#B00020"
                strokeWidth={2}
                fill="url(#colorRegistros)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <RecentContainer>
          <h3>Últimas incorporaciones</h3>
          {metricas.recientes.length === 0 ? (
            <p>No hay registros recientes.</p>
          ) : (
            <RecentList>
              {metricas.recientes.map((registro) => (
                <RecentItem key={registro.id}>
                  <strong>{registro.nombre || "Sin nombre"}</strong>
                  <span>{registro.email}</span>
                  <span>
                    {new Date(registro.creado).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </RecentItem>
              ))}
            </RecentList>
          )}
        </RecentContainer>
      </InsightsRow>
    </DashboardContainer>
  );
};

export default Dashboard;
