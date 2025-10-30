import React, { useEffect, useState } from "react";
import { calcularMetricas } from "../../api/asistenciaService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../card/card"; // 🧩 Nuevo componente
import {
  DashboardContainer,
  DashboardTitle,
  MetricCards,
  ChartContainer,
  Message,
} from "./DashboardStyles";

interface Metricas {
  totalTrabajadores: number;
  asistieronHoy: number;
  llegadasTarde: number;
  puntualidad: number | string;
  resumenDiario: { fecha: string; asistencias: number }[];
}

interface DashboardProps {
  sidebarAbierta?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarAbierta }) => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
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

  return (
    <DashboardContainer sidebarAbierta={sidebarAbierta}>
      <DashboardTitle>Dashboard de Asistencia</DashboardTitle>

      <MetricCards>
        <Card title="Total Trabajadores" value={metricas.totalTrabajadores} />
        <Card title="Asistieron Hoy" value={metricas.asistieronHoy} />
        <Card title="Llegadas Tarde" value={metricas.llegadasTarde} />
        <Card title="Puntualidad" value={`${metricas.puntualidad}%`} />
      </MetricCards>

      <ChartContainer>
        <h3>Asistencias Últimos 7 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={metricas.resumenDiario}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="asistencias" fill="#B00020" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
