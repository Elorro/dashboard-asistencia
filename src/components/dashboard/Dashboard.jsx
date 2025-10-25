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
import "./dashboard.css";

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
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

  if (loading) return <p>Cargando métricas...</p>;
  if (!metricas) return <p>No se pudieron cargar las métricas.</p>;

  // Transformar resumen diario a array para Recharts
  const dataGrafico = Object.entries(metricas.resumenDiario).map(
    ([fecha, count]) => ({
      fecha: fecha.slice(5), // MM-DD
      asistencias: count,
    })
  );

  return (
    <div className="dashboard-container">
      <h2>Dashboard de Asistencia</h2>
      <div className="metric-cards">
        <div className="card">
          <h3>Total Trabajadores</h3>
          <p>{metricas.totalTrabajadores}</p>
        </div>
        <div className="card">
          <h3>Asistieron Hoy</h3>
          <p>{metricas.asistieronHoy}</p>
        </div>
        <div className="card">
          <h3>Llegadas Tarde</h3>
          <p>{metricas.llegadasTarde}</p>
        </div>
        <div className="card">
          <h3>Puntualidad</h3>
          <p>{metricas.puntualidad}%</p>
        </div>
      </div>

      <h3>Asistencias Últimos 7 Días</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dataGrafico}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="asistencias" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
