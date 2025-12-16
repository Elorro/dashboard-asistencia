import React, { useState } from "react";
import {
  DevicesContainer,
  DeviceTable,
  StatusBadge,
  ActionButton,
} from "./Devices.styles";
import {
  registrarDispositivo,
  type DeviceRegisterPayload,
  type DeviceRegisterResponse,
} from "../../api/asistenciaService";

type RegisteredDevice = DeviceRegisterResponse["data"] & {
  device_name: string;
  device_model: string;
  device_manufacturer: string;
  android_version: string;
};

const Devices: React.FC = () => {
  const [form, setForm] = useState<DeviceRegisterPayload>({
    activation_code: "",
    device_id: "",
    device_name: "",
    device_model: "",
    device_manufacturer: "",
    android_version: "",
  });
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof DeviceRegisterPayload,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);
    setLoading(true);

    try {
      const response = await registrarDispositivo(form);
      setDevices((prev) => [
        {
          ...response.data,
          device_name: form.device_name,
          device_model: form.device_model,
          device_manufacturer: form.device_manufacturer,
          android_version: form.android_version,
        },
        ...prev,
      ]);
      setFeedback("Dispositivo registrado exitosamente.");
      setForm({
        activation_code: "",
        device_id: "",
        device_name: "",
        device_model: "",
        device_manufacturer: "",
        android_version: "",
      });
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

  return (
    <DevicesContainer>
      <h2>Alta de Dispositivos</h2>
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

      <h3>Historial de registros</h3>
      <DeviceTable>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Fabricante</th>
            <th>Android</th>
            <th>Device ID</th>
            <th>Tenant</th>
            <th>Token</th>
            <th>Activo</th>
            <th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.device_id}>
              <td>{d.device_name}</td>
              <td>{d.device_model}</td>
              <td>{d.device_manufacturer}</td>
              <td>{d.android_version}</td>
              <td>{d.device_id}</td>
              <td>{d.tenant_id}</td>
              <td className="token-cell">
                <code>{d.device_token}</code>
              </td>
              <td>
                <StatusBadge active={d.is_active}>
                  {d.is_active ? "Activo" : "Inactivo"}
                </StatusBadge>
              </td>
              <td>
                {new Date(d.registered_at).toLocaleString()}
              </td>
            </tr>
          ))}

          {devices.length === 0 && (
            <tr>
              <td colSpan={8}>Aún no hay dispositivos registrados.</td>
            </tr>
          )}
        </tbody>
      </DeviceTable>
    </DevicesContainer>
  );
};

export default Devices;
