import styled from "styled-components";

export const MetricsContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  h2 {
    margin-bottom: 24px;
    color: #333;
    font-size: 28px;
  }

  h3 {
    margin-top: 32px;
    margin-bottom: 16px;
    color: #444;
    font-size: 20px;
  }
`;

export const TenantInput = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  input {
    width: 100%;
    max-width: 400px;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 12px;

    &:focus {
      outline: none;
      border-color: #1976d2;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div<{ color?: string }>`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${(props) => props.color || "#1976d2"};

  .stat-label {
    font-size: 13px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
  }

  .stat-description {
    font-size: 12px;
    color: #999;
  }
`;

export const FiltersSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .filter-field {
    display: flex;
    flex-direction: column;

    label {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 6px;
      color: #444;
    }

    input,
    select {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 4px;

      &:focus {
        outline: none;
        border-color: #1976d2;
      }
    }
  }

  .filter-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }
`;

export const ActionButton = styled.button<{ active?: boolean; variant?: string }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  background: ${(props) => {
    if (props.variant === "secondary") return "#6c757d";
    if (props.variant === "danger") return "#dc3545";
    return "#1976d2";
  }};
  color: white;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => {
      if (props.variant === "secondary") return "#5a6268";
      if (props.variant === "danger") return "#c82333";
      return "#145ca8";
    }};
  }
`;

export const MetricsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;

  thead {
    background: #f8f9fa;

    th {
      padding: 14px 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #dee2e6;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #eee;
      transition: background 0.15s;

      &:hover {
        background: #f8f9fa;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 12px;
      font-size: 14px;
      color: #333;

      &.center {
        text-align: center;
      }
    }
  }
`;

export const StatusBadge = styled.span<{ status: "success" | "failure" | "rejected" }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    if (props.status === "success") return "#d4edda";
    if (props.status === "failure") return "#f8d7da";
    return "#fff3cd";
  }};
  color: ${(props) => {
    if (props.status === "success") return "#155724";
    if (props.status === "failure") return "#721c24";
    return "#856404";
  }};
`;

export const QualityBar = styled.div<{ value: number }>`
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .fill {
    height: 100%;
    width: ${(props) => props.value * 100}%;
    background: ${(props) => {
      if (props.value >= 0.8) return "#4caf50";
      if (props.value >= 0.6) return "#ff9800";
      return "#f44336";
    }};
    border-radius: 10px;
    transition: width 0.3s;
  }

  .label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 11px;
    font-weight: 600;
    color: #333;
  }
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const ChartCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #333;
  }
`;
