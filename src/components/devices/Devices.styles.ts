import styled from "styled-components";

export const DevicesContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};

  form {
    background: ${({ theme }) => theme.colors.surface};
    padding: 16px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.shadow};
    margin-bottom: 24px;

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    input {
      padding: 10px;
      border: 1px solid ${({ theme }) => theme.colors.borderSoft};
      border-radius: 6px;
      font-size: 0.95rem;
    }
  }
`;

export const DeviceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 600;
  }

  .token-cell {
    max-width: 260px;
    word-break: break-all;
  }
`;

export const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  background: ${({ active }) => (active ? "#4caf50" : "#d32f2f")};
  color: white;
`;

export const ActionButton = styled.button<{ active?: boolean }>`
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ active }) => (active === false ? "#4caf50" : "#B00020")};
  color: white;
  transition: background 0.3s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
