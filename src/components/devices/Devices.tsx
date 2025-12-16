import React, { useState, useEffect } from "react";
import {
  DevicesContainer,
  DeviceTable,
  StatusBadge,
  ActionButton,
} from "./Devices.styles";
import {
  registrarDispositivo,
  obtenerDispositivos,
  desactivarDispositivo,
  type DeviceRegisterPayload,
  type Device,
} from "../../api/asistenciaService";
import { useAuthStore } from "../../store/authStore";

const Devices: React.FC = () => {
  const { accessToken } = useAuthStore();
  const [form, setForm] = useState<DeviceRegisterPayload>({
    activation_code: "",
    device_id: "",
    device_name: "",
    device_model: "",
    device_manufacturer: "",
    android_version: "",
  });
  const [tenantId, setTenantId] = useState<string>("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const handleChange = (
    field: keyof DeviceRegisterPayload,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const loadDevices = async () => {
    if (!accessToken || !tenantId) return;

    setLoadingDevices(true);
    setError(null);
    try {
      const devicesList = await obtenerDispositivos(accessToken, tenantId);
      setDevices(devicesList);
    } catch (err) {
      console.error("Error cargando dispositivos", err);
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar los dispositivos."
      );
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    if (tenantId && accessToken) {
      loadDevices();
    }
  }, [tenantId, accessToken]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);
    setLoading(true);

    try {
      await registrarDispositivo(form);
      setFeedback("Dispositivo registrado exitosamente.");
      setForm({
        activation_code: "",
        device_id: "",
        device_name: "",
        device_model: "",
        device_manufacturer: "",
        android_version: "",
      });
      // Recargar lista de dispositivos
      if (tenantId && accessToken) {
        await loadDevices();
      }
    } catch (err) {
      console.error("Error registrando dispositivo", err);
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible registrar el dispositivo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (deviceId: string) => {
    if (!accessToken || !tenantId) {
      setError("No hay token de autenticación o tenant ID.");
      return;
    }

    const reason = window.prompt("Ingresa la razón de desactivación:");
    if (!reason) return;

    setError(null);
    setFeedback(null);

    try {
      await desactivarDispositivo(deviceId, accessToken, tenantId, reason);
      setFeedback("Dispositivo desactivado exitosamente.");
      // Recargar lista de dispositivos
      await loadDevices();
    } catch (err) {
      console.error("Error desactivando dispositivo", err);
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible desactivar el dispositivo."
      );
    }
  };

  return (
    <DevicesContainer>
      <h2>Gestión de Dispositivos</h2>

      {/* Tenant ID Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Tenant ID (requerido para listar y gestionar dispositivos):
        </label>
        <input
          placeholder="Ingresa el Tenant ID (ej: ACME)"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value.toUpperCase())}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "8px 12px",
            fontSize: 14,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        {tenantId && accessToken && (
          <ActionButton
            type="button"
            active={!loadingDevices}
            disabled={loadingDevices}
            onClick={loadDevices}
            style={{ marginTop: 8 }}
          >
            {loadingDevices ? "Cargando..." : "Recargar dispositivos"}
          </ActionButton>
        )}
      </div>

      <h3>Registrar Nuevo Dispositivo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            placeholder="Código de activación (TENANT-CODE)"
            value={form.activation_code}
            onChange={(e) => handleChange("activation_code", e.target.value)}
            required
          />
          <input
            placeholder="ID del dispositivo (UUID)"
            value={form.device_id}
            onChange={(e) => handleChange("device_id", e.target.value)}
            required
          />
          <input
            placeholder="Nombre del dispositivo"
            value={form.device_name}
            onChange={(e) => handleChange("device_name", e.target.value)}
            required
          />
          <input
            placeholder="Modelo"
            value={form.device_model}
            onChange={(e) => handleChange("device_model", e.target.value)}
            required
          />
          <input
            placeholder="Fabricante"
            value={form.device_manufacturer}
            onChange={(e) => handleChange("device_manufacturer", e.target.value)}
            required
          />
          <input
            placeholder="Versión Android"
            value={form.android_version}
            onChange={(e) => handleChange("android_version", e.target.value)}
            required
          />
        </div>
        <ActionButton type="submit" active={!loading} disabled={loading}>
          {loading ? "Registrando..." : "Registrar dispositivo"}
        </ActionButton>
      </form>

      {feedback && <p style={{ color: "#2e7d32", marginTop: 12 }}>{feedback}</p>}
      {error && <p style={{ color: "#c62828", marginTop: 12 }}>{error}</p>}

      <h3>Lista de Dispositivos</h3>
      {loadingDevices && <p>Cargando dispositivos...</p>}
      {!tenantId && !loadingDevices && (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          Ingresa un Tenant ID para ver la lista de dispositivos.
        </p>
      )}
      {tenantId && !loadingDevices && (
        <DeviceTable>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Modelo</th>
              <th>Device ID</th>
              <th>Estado</th>
              <th>Registrado</th>
              <th>Última Sincronización</th>
              <th>Registros Pendientes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.device_id}>
                <td>{d.device_name}</td>
                <td>{d.device_model}</td>
                <td>{d.device_id}</td>
                <td>
                  <StatusBadge active={d.is_active}>
                    {d.is_active ? "Activo" : "Inactivo"}
                  </StatusBadge>
                </td>
                <td>{new Date(d.registered_at).toLocaleString()}</td>
                <td>{new Date(d.last_sync_at).toLocaleString()}</td>
                <td>{d.pending_records}</td>
                <td>
                  {d.is_active && (
                    <ActionButton
                      type="button"
                      active
                      onClick={() => handleDeactivate(d.device_id)}
                      style={{
                        padding: "4px 12px",
                        fontSize: 12,
                        backgroundColor: "#d32f2f",
                      }}
                    >
                      Desactivar
                    </ActionButton>
                  )}
                </td>
              </tr>
            ))}

            {devices.length === 0 && (
              <tr>
                <td colSpan={8}>
                  No hay dispositivos registrados para este tenant.
                </td>
              </tr>
            )}
          </tbody>
        </DeviceTable>
      )}
    </DevicesContainer>
  );
};

export default Devices;
