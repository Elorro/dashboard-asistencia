// src/api/asistenciaService.ts

// URL base de la API (usa variable de entorno o fallback local)
const API_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/* =============================
   Tipos de datos
============================= */
export interface Trabajador {
  employee_id: string;
  nombres: string;
  apellidos: string;
  departamento: string;
  cargo: string;
  image_urls?: string[];
}

export interface Asistencia {
  id?: number;
  employee_id: string;
  timestamp: string;
  event_type: "entry" | "exit";
}

/* =============================
   Función auxiliar para fechas
============================= */
const getISODate = (date: Date): string =>
  (date.toISOString().split("T")[0] ?? "") as string;

/* =============================
   Obtener todos los trabajadores
============================= */
export async function obtenerTrabajadores(): Promise<Trabajador[]> {
  try {
    const res = await fetch(`${API_URL}/workers`);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error obteniendo trabajadores:", error);
    return [];
  }
}

/* =============================
   Crear nuevo trabajador
============================= */
export async function crearTrabajador(
  trabajador: Trabajador
): Promise<Trabajador> {
  try {
    const res = await fetch(`${API_URL}/workers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trabajador),
    });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error creando trabajador:", error);
    throw error;
  }
}

/* =============================
   Actualizar trabajador
============================= */
export async function actualizarTrabajador(
  id: string,
  datos: Partial<Trabajador>
): Promise<Trabajador> {
  try {
    const res = await fetch(`${API_URL}/workers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error actualizando trabajador:", error);
    throw error;
  }
}

/* =============================
   Eliminar trabajador
============================= */
export async function eliminarTrabajador(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/workers/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    return true;
  } catch (error) {
    console.error("Error eliminando empleado:", error);
    return false;
  }
}

/* =============================
   Obtener asistencias
============================= */
export async function obtenerAsistencias(): Promise<Asistencia[]> {
  try {
    const res = await fetch(`${API_URL}/timestamps`);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error obteniendo asistencias:", error);
    return [];
  }
}

/* =============================
   Calcular métricas globales
============================= */
export async function calcularMetricas() {
  try {
    const trabajadores = await obtenerTrabajadores();
    const asistencias = await obtenerAsistencias();

    const totalTrabajadores = trabajadores.length;

    // Filtrar asistencias de hoy
    const hoy: string = getISODate(new Date());
    const asistieronHoy = asistencias.filter((a) =>
      a.timestamp.startsWith(hoy)
    ).length;

    const llegadasTarde = asistencias.filter((a) => {
      if (a.event_type !== "entry") return false;
      const hora = new Date(a.timestamp).getHours();
      return hora > 8; // Ajusta según horario laboral real
    }).length;

    const puntualidad =
      totalTrabajadores === 0
        ? 0
        : (((asistieronHoy - llegadasTarde) / totalTrabajadores) * 100).toFixed(
            2
          );

    // Resumen últimos 7 días
    const resumenDiario = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - (6 - i));
      const fechaStr: string = getISODate(fecha);
      const count = asistencias.filter((a) =>
        a.timestamp.startsWith(fechaStr)
      ).length;
      return { fecha: fechaStr, asistencias: count };
    });

    return {
      totalTrabajadores,
      asistieronHoy,
      llegadasTarde,
      puntualidad,
      resumenDiario,
    };
  } catch (error) {
    console.error("Error calculando métricas:", error);
    return {
      totalTrabajadores: 0,
      asistieronHoy: 0,
      llegadasTarde: 0,
      puntualidad: 0,
      resumenDiario: [],
    };
  }
}
