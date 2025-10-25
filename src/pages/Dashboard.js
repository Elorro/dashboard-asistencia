import React, { useEffect, useState } from "react";
import api from "../api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Card from "../components/card/card";

export default function Dashboard() {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/biometric-data"); // Ruta de ejemplo en tu API
        setRegistros(res.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Asistencia del Personal</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card title="Empleados activos" value="120" />
        <Card title="Asistencias hoy" value="98" />
        <Card title="Ausencias" value="22" />
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Tendencia de asistencia</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={registros}>
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="asistencias"
              stroke="#007bff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
