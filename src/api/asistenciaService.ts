// src/api/asistenciaService.ts

// URL base de la API (usa variable de entorno o fallback local)
const API_URL: string =
  import.meta.env.VITE_API_URL || "http://44.197.239.208:8000/api";

/* =============================
   Tipos de datos – alineados con Sioma API
============================= */
export interface Trabajador {
  id: string;
  document_id: string;
  first_name: string;
  last_name: string;
  email: string;
  image_urls: string[];
  created_at: string;
}

export interface NuevoTrabajadorPayload {
  personalData: {
    document_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  images: File[];
}

export interface TrabajadorUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface TimeLog {
  id: string;
  worker_id: string;
  timestamp: string;
  event_type: "entry" | "exit";
}

export interface DeviceRegisterPayload {
  activation_code: string;
  device_id: string;
  device_name: string;
  device_model: string;
  device_manufacturer: string;
  android_version: string;
}

export interface DeviceRegisterResponse {
  success: boolean;
  data: {
    device_id: string;
    tenant_id: string;
    device_token: string;
    token_expires_at: number | null;
    is_active: boolean;
    registered_at: number;
  };
}

export interface DashboardMetrics {
  totalRegistrados: number;
  registradosUltimos7: number;
  registradosUltimos30: number;
  promedioDiario: number;
  crecimientoSemanal: number;
  registrosPorDia: Array<{ fecha: string; etiqueta: string; registros: number }>;
  recientes: Array<{
    id: string;
    nombre: string;
    email: string;
    creado: string;
  }>;
}

/* =============================
   Utilidades
============================= */
const getISODate = (date: Date): string =>
  (date.toISOString().split("T")[0] ?? "") as string;

const throwIfNotOk = async (response: Response) => {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Error HTTP: ${response.status}`);
  }
};

/* =============================
   Trabajadores
============================= */
export async function obtenerTrabajadores(): Promise<Trabajador[]> {
  const res = await fetch(`${API_URL}/workers`);
  await throwIfNotOk(res);
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        image_urls: Array.isArray(item.image_urls) ? item.image_urls : [],
        created_at:
          typeof item.created_at === "string"
            ? item.created_at
            : new Date(item.created_at).toISOString(),
      }))
    : [];
}

export async function crearTrabajador(
  payload: NuevoTrabajadorPayload
): Promise<Trabajador> {
  if (payload.images.length !== 7) {
    throw new Error(
      "Debes adjuntar exactamente 7 imágenes para registrar al trabajador."
    );
  }

  const formData = new FormData();
  formData.append("personal_data_json", JSON.stringify(payload.personalData));
  payload.images.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/workers`, {
    method: "POST",
    body: formData,
  });
  await throwIfNotOk(res);
  const trabajador = await res.json();
  return {
    ...trabajador,
    image_urls: Array.isArray(trabajador.image_urls)
      ? trabajador.image_urls
      : [],
    created_at: new Date(trabajador.created_at).toISOString(),
  };
}

export async function actualizarTrabajador(
  id: string,
  datos: TrabajadorUpdatePayload
): Promise<Trabajador> {
  const res = await fetch(`${API_URL}/workers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  await throwIfNotOk(res);
  const trabajador = await res.json();
  return {
    ...trabajador,
    image_urls: Array.isArray(trabajador.image_urls)
      ? trabajador.image_urls
      : [],
    created_at: new Date(trabajador.created_at).toISOString(),
  };
}

export async function eliminarTrabajador(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/workers/${id}`, { method: "DELETE" });
  await throwIfNotOk(res);
}

/* =============================
   Timestamps
============================= */
export async function obtenerTimestamps(): Promise<TimeLog[]> {
  const res = await fetch(`${API_URL}/timestamps`);
  await throwIfNotOk(res);
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        timestamp:
          typeof item.timestamp === "string"
            ? item.timestamp
            : new Date(item.timestamp).toISOString(),
      }))
    : [];
}

/* =============================
   Métricas del dashboard
============================= */
export async function calcularMetricas(): Promise<DashboardMetrics> {
  try {
    const trabajadores = await obtenerTrabajadores();
    const totalRegistrados = trabajadores.length;

    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const dias = 30;
    const diaEnMs = 24 * 60 * 60 * 1000;

    const inicio7 = new Date(inicioHoy.getTime() - 6 * diaEnMs);
    const inicio30 = new Date(inicioHoy.getTime() - (dias - 1) * diaEnMs);
    const inicioSemanaAnterior = new Date(inicio7.getTime() - 7 * diaEnMs);

    const registradosUltimos7 = trabajadores.filter((trabajador) => {
      const fecha = new Date(trabajador.created_at);
      return fecha >= inicio7;
    }).length;

    const registradosPrevios7 = trabajadores.filter((trabajador) => {
      const fecha = new Date(trabajador.created_at);
      return fecha >= inicioSemanaAnterior && fecha < inicio7;
    }).length;

    const registradosUltimos30 = trabajadores.filter((trabajador) => {
      const fecha = new Date(trabajador.created_at);
      return fecha >= inicio30;
    }).length;

    const crecimientoSemanal =
      registradosPrevios7 === 0
        ? registradosUltimos7 > 0
          ? 100
          : 0
        : ((registradosUltimos7 - registradosPrevios7) / registradosPrevios7) *
          100;

    const registrosPorDia = Array.from({ length: dias }, (_, index) => {
      const fecha = new Date(inicio30.getTime() + index * diaEnMs);
      const iso = getISODate(fecha);
      const registros = trabajadores.filter(
        (trabajador) => getISODate(new Date(trabajador.created_at)) === iso
      ).length;

      const etiqueta = `${String(fecha.getDate()).padStart(2, "0")}/${String(
        fecha.getMonth() + 1
      ).padStart(2, "0")}`;

      return { fecha: iso, etiqueta, registros };
    });

    const promedioDiario = registradosUltimos30 / dias;

    const recientes = [...trabajadores]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map((trabajador) => ({
        id: trabajador.id,
        nombre: `${trabajador.first_name} ${trabajador.last_name}`.trim(),
        email: trabajador.email,
        creado: new Date(trabajador.created_at).toISOString(),
      }));

    return {
      totalRegistrados,
      registradosUltimos7,
      registradosUltimos30,
      promedioDiario,
      crecimientoSemanal,
      registrosPorDia,
      recientes,
    };
  } catch (error) {
    console.error("Error calculando métricas:", error);
    return {
      totalRegistrados: 0,
      registradosUltimos7: 0,
      registradosUltimos30: 0,
      promedioDiario: 0,
      crecimientoSemanal: 0,
      registrosPorDia: [],
      recientes: [],
    };
  }
}

/* =============================
   Dispositivos
============================= */
export async function registrarDispositivo(
  payload: DeviceRegisterPayload
): Promise<DeviceRegisterResponse> {
  const res = await fetch(`${API_URL}/devices/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await throwIfNotOk(res);
  return res.json();
}
