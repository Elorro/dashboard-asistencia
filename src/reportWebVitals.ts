/**
 * reportWebVitals.ts
 * ------------------------------------------------------
 * Este archivo mide métricas clave de rendimiento (web vitals)
 * y las reporta al callback que definas, por ejemplo para analytics.
 * ------------------------------------------------------
 */

import type { ReportHandler } from "web-vitals";

/**
 * Registra y envía métricas de rendimiento de la aplicación.
 *
 * @param onPerfEntry - Función callback que recibe las métricas.
 *                      Por ejemplo, (metric) => console.log(metric)
 *
 * Cada métrica incluye:
 *  - name: Nombre de la métrica (CLS, FID, FCP, LCP, TTFB)
 *  - value: Valor numérico medido
 *  - id: Identificador único
 *  - delta: Diferencia con el valor anterior
 *  - entries: Performance entries relacionados
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
