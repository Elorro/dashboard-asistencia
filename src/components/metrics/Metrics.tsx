import React, { useState, useEffect, useMemo } from "react";
import {
  MetricsContainer,
  TenantInput,
  StatsGrid,
  StatCard,
  FiltersSection,
  ActionButton,
  MetricsTable,
  StatusBadge,
  QualityBar,
  ChartsGrid,
  ChartCard,
} from "./Metrics.styles";
import {
  obtenerMetricasAsistencia,
  type AttendanceMetric,
  type AttendanceMetricsFilters,
} from "../../api/asistenciaService";
import { useAuthStore } from "../../store/authStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4caf50", "#f44336", "#ff9800"];

const Metrics: React.FC = () => {
  const { accessToken } = useAuthStore();
  const [tenantId, setTenantId] = useState<string>("");
  const [metrics, setMetrics] = useState<AttendanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState<AttendanceMetricsFilters>({
    limit: 100,
  });
  const [deviceIdFilter, setDeviceIdFilter] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");
  const [rejectedFilter, setRejectedFilter] = useState<string>("all");

  const loadMetrics = async () => {
    if (!accessToken || !tenantId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await obtenerMetricasAsistencia(
        accessToken,
        tenantId,
        filters
      );
      setMetrics(data);
    } catch (err) {
      console.error("Error cargando métricas", err);
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar las métricas."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const newFilters: AttendanceMetricsFilters = {
      limit: filters.limit || 100,
    };

    if (deviceIdFilter) newFilters.device_id = deviceIdFilter;
    if (employeeIdFilter) newFilters.employee_id = employeeIdFilter;
    if (successFilter !== "all")
      newFilters.recognition_successful = successFilter === "true";
    if (rejectedFilter !== "all")
      newFilters.rejected_by_user = rejectedFilter === "true";

    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setDeviceIdFilter("");
    setEmployeeIdFilter("");
    setSuccessFilter("all");
    setRejectedFilter("all");
    setFilters({ limit: 100 });
  };

  useEffect(() => {
    if (tenantId && accessToken) {
      loadMetrics();
    }
  }, [tenantId, accessToken, filters]);

  // Cálculos de estadísticas
  const stats = useMemo(() => {
    const total = metrics.length;
    const successful = metrics.filter((m) => m.recognition_successful).length;
    const rejected = metrics.filter((m) => m.rejected_by_user).length;
    const failed = total - successful;

    const avgQuality =
      total > 0
        ? metrics.reduce((sum, m) => sum + m.metrics.overall_quality, 0) / total
        : 0;

    const avgConfidence =
      successful > 0
        ? metrics
            .filter((m) => m.metrics.confidence !== null)
            .reduce((sum, m) => sum + (m.metrics.confidence || 0), 0) / successful
        : 0;

    const avgProcessingTime =
      total > 0
        ? metrics.reduce((sum, m) => sum + m.metrics.processing_time_ms, 0) /
          total
        : 0;

    return {
      total,
      successful,
      failed,
      rejected,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      avgQuality,
      avgConfidence,
      avgProcessingTime,
    };
  }, [metrics]);

  // Datos para gráficos
  const successDistribution = [
    { name: "Exitosos", value: stats.successful },
    { name: "Fallidos", value: stats.failed },
    { name: "Rechazados", value: stats.rejected },
  ];

  const qualityDistribution = useMemo(() => {
    const buckets = { excellent: 0, good: 0, fair: 0, poor: 0 };
    metrics.forEach((m) => {
      const q = m.metrics.overall_quality;
      if (q >= 0.9) buckets.excellent++;
      else if (q >= 0.75) buckets.good++;
      else if (q >= 0.6) buckets.fair++;
      else buckets.poor++;
    });

    return [
      { name: "Excelente (≥0.9)", value: buckets.excellent },
      { name: "Buena (≥0.75)", value: buckets.good },
      { name: "Regular (≥0.6)", value: buckets.fair },
      { name: "Pobre (<0.6)", value: buckets.poor },
    ];
  }, [metrics]);

  return (
    <MetricsContainer>
      <h2>Métricas de Reconocimiento Facial</h2>

      <TenantInput>
        <label>Tenant ID (requerido para cargar métricas):</label>
        <input
          placeholder="Ingresa el Tenant ID (ej: ACME)"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value.toUpperCase())}
        />
        {tenantId && accessToken && (
          <ActionButton onClick={loadMetrics} disabled={loading}>
            {loading ? "Cargando..." : "Cargar métricas"}
          </ActionButton>
        )}
      </TenantInput>

      {error && <p style={{ color: "#d32f2f", marginBottom: 16 }}>{error}</p>}

      {tenantId && accessToken && !loading && metrics.length > 0 && (
        <>
          <h3>Estadísticas Generales</h3>
          <StatsGrid>
            <StatCard color="#1976d2">
              <div className="stat-label">Total de Registros</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-description">Métricas recopiladas</div>
            </StatCard>

            <StatCard color="#4caf50">
              <div className="stat-label">Reconocimientos Exitosos</div>
              <div className="stat-value">{stats.successful}</div>
              <div className="stat-description">
                {stats.successRate.toFixed(1)}% de éxito
              </div>
            </StatCard>

            <StatCard color="#f44336">
              <div className="stat-label">Reconocimientos Fallidos</div>
              <div className="stat-value">{stats.failed}</div>
              <div className="stat-description">
                {stats.rejected} rechazados por usuario
              </div>
            </StatCard>

            <StatCard color="#ff9800">
              <div className="stat-label">Calidad Promedio</div>
              <div className="stat-value">
                {(stats.avgQuality * 100).toFixed(1)}%
              </div>
              <div className="stat-description">Overall quality score</div>
            </StatCard>

            <StatCard color="#9c27b0">
              <div className="stat-label">Confianza Promedio</div>
              <div className="stat-value">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </div>
              <div className="stat-description">En reconocimientos exitosos</div>
            </StatCard>

            <StatCard color="#00bcd4">
              <div className="stat-label">Tiempo de Procesamiento</div>
              <div className="stat-value">
                {stats.avgProcessingTime.toFixed(0)}ms
              </div>
              <div className="stat-description">Promedio por reconocimiento</div>
            </StatCard>
          </StatsGrid>

          <h3>Distribución de Resultados</h3>
          <ChartsGrid>
            <ChartCard>
              <h4>Por Estado de Reconocimiento</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={successDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {successDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <h4>Por Calidad de Imagen</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={qualityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1976d2" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsGrid>

          <h3>Filtros de Búsqueda</h3>
          <FiltersSection>
            <div className="filters-grid">
              <div className="filter-field">
                <label>Device ID</label>
                <input
                  type="text"
                  placeholder="Filtrar por dispositivo"
                  value={deviceIdFilter}
                  onChange={(e) => setDeviceIdFilter(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <label>Employee ID</label>
                <input
                  type="text"
                  placeholder="Filtrar por empleado"
                  value={employeeIdFilter}
                  onChange={(e) => setEmployeeIdFilter(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <label>Estado de Reconocimiento</label>
                <select
                  value={successFilter}
                  onChange={(e) => setSuccessFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="true">Solo exitosos</option>
                  <option value="false">Solo fallidos</option>
                </select>
              </div>

              <div className="filter-field">
                <label>Rechazado por Usuario</label>
                <select
                  value={rejectedFilter}
                  onChange={(e) => setRejectedFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="true">Solo rechazados</option>
                  <option value="false">No rechazados</option>
                </select>
              </div>

              <div className="filter-field">
                <label>Límite de Registros</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={filters.limit || 100}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="filter-actions">
              <ActionButton onClick={handleApplyFilters}>
                Aplicar Filtros
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleClearFilters}>
                Limpiar Filtros
              </ActionButton>
            </div>
          </FiltersSection>

          <h3>Detalle de Métricas ({metrics.length} registros)</h3>
          <MetricsTable>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Empleado</th>
                <th>Estado</th>
                <th>Calidad General</th>
                <th>Confianza</th>
                <th>Nitidez</th>
                <th>Iluminación</th>
                <th>Tiempo Proc.</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.metrics_id}>
                  <td>{new Date(metric.timestamp).toLocaleString()}</td>
                  <td>
                    {metric.employee_id_number || metric.employee_id || "N/A"}
                  </td>
                  <td>
                    {metric.rejected_by_user ? (
                      <StatusBadge status="rejected">Rechazado</StatusBadge>
                    ) : metric.recognition_successful ? (
                      <StatusBadge status="success">Exitoso</StatusBadge>
                    ) : (
                      <StatusBadge status="failure">Fallido</StatusBadge>
                    )}
                  </td>
                  <td>
                    <QualityBar value={metric.metrics.overall_quality}>
                      <div className="fill" />
                      <div className="label">
                        {(metric.metrics.overall_quality * 100).toFixed(0)}%
                      </div>
                    </QualityBar>
                  </td>
                  <td>
                    {metric.metrics.confidence !== null
                      ? `${(metric.metrics.confidence * 100).toFixed(1)}%`
                      : "N/A"}
                  </td>
                  <td>{(metric.metrics.blur_score * 100).toFixed(0)}%</td>
                  <td>{(metric.metrics.brightness_score * 100).toFixed(0)}%</td>
                  <td>{metric.metrics.processing_time_ms}ms</td>
                </tr>
              ))}

              {metrics.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
                    No hay métricas disponibles con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </MetricsTable>
        </>
      )}

      {tenantId && !loading && metrics.length === 0 && !error && (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          No hay métricas disponibles para este tenant.
        </p>
      )}

      {!tenantId && (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          Ingresa un Tenant ID para ver las métricas de reconocimiento facial.
        </p>
      )}
    </MetricsContainer>
  );
};

export default Metrics;
