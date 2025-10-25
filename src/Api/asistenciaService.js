/*// src/api/asistenciaService.js
const API_URL = "http://localhost:8000/api";

export async function obtenerTrabajadores() {
  const res = await fetch(`${API_URL}/workers`);
  if (!res.ok) throw new Error("Error al obtener trabajadores");
  return await res.json();
}

export async function obtenerAsistencias() {
  const res = await fetch(`${API_URL}/timestamps`);
  if (!res.ok) throw new Error("Error al obtener asistencias");
  return await res.json();
}

// Métricas y resumen diario
export async function calcularMetricas() {
  const trabajadores = await obtenerTrabajadores();
  const asistencias = await obtenerAsistencias();

  const totalTrabajadores = trabajadores.length;

  // Filtrar asistencias de hoy
  const hoy = new Date().toISOString().split("T")[0];
  const asistieronHoy = asistencias.filter((a) =>
    a.timestamp.startsWith(hoy)
  ).length;

  const llegadasTarde = asistencias.filter((a) => {
    if (a.event_type !== "entry") return false;
    const hora = new Date(a.timestamp).getHours();
    return hora > 8; // Ajusta según horario real
  }).length;

  const puntualidad =
    totalTrabajadores === 0
      ? 0
      : (((asistieronHoy - llegadasTarde) / totalTrabajadores) * 100).toFixed(
          2
        );

  // Resumen diario (últimos 7 días)
  const resumenDiario = {};
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split("T")[0];
    const count = asistencias.filter((a) =>
      a.timestamp.startsWith(fechaStr)
    ).length;
    resumenDiario[fechaStr] = count;
  }

  return {
    totalTrabajadores,
    asistieronHoy,
    llegadasTarde,
    puntualidad,
    resumenDiario,
  };
}
*/


 const API_URL = "http://localhost:8000/api"; // Cambia si tu API está en producción

// Obtener todos los trabajadores desde la API
export async function obtenerTrabajadores() {
  try {
    const res = await fetch(`${API_URL}/workers`);
    if (!res.ok) throw new Error("Error al obtener trabajadores");
    return await res.json();
  } catch (err) {
    console.warn("No se pudo conectar a la API, usando datos mock:", err);
    // Datos de ejemplo si la API falla
    return [
      { id: "1", name: "Juan Perez", department: "Ventas" },
      { id: "2", name: "Ana Lopez", department: "Marketing" },
      { id: "3", name: "Luis Gomez", department: "IT" },
    ];
  }
}

// Obtener todas las asistencias desde la API
export async function obtenerAsistencias() {
  try {
    const res = await fetch(`${API_URL}/timestamps`);
    if (!res.ok) throw new Error("Error al obtener asistencias");
    return await res.json();
  } catch (err) {
    console.warn("No se pudo conectar a la API, usando datos mock:", err);
    const hoy = new Date().toISOString().split("T")[0];
    return [
      { worker_id: "1", event_type: "entry", timestamp: hoy + "T08:05:00Z" },
      { worker_id: "2", event_type: "entry", timestamp: hoy + "T08:20:00Z" },
      { worker_id: "3", event_type: "entry", timestamp: hoy + "T07:55:00Z" },
    ];
  }
}

// Calcular métricas y resumen diario
export async function calcularMetricas() {
  const trabajadores = await obtenerTrabajadores();
  const asistencias = await obtenerAsistencias();

  const totalTrabajadores = trabajadores.length;

  // Filtrar asistencias de hoy
  const hoy = new Date().toISOString().split("T")[0];
  const asistieronHoy = asistencias.filter((a) =>
    a.timestamp.startsWith(hoy)
  ).length;

  const llegadasTarde = asistencias.filter((a) => {
    if (a.event_type !== "entry") return false;
    const hora = new Date(a.timestamp).getHours();
    return hora > 8; // Ajusta según horario real
  }).length;

  const puntualidad =
    totalTrabajadores === 0
      ? 0
      : (((asistieronHoy - llegadasTarde) / totalTrabajadores) * 100).toFixed(
          2
        );

  // Resumen diario últimos 7 días
  const resumenDiario = {};
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split("T")[0];
    const count = asistencias.filter((a) =>
      a.timestamp.startsWith(fechaStr)
    ).length;
    resumenDiario[fechaStr] = count;
  }

  return {
    totalTrabajadores,
    asistieronHoy,
    llegadasTarde,
    puntualidad,
    resumenDiario,
  };
}

