import styled from "styled-components";

/* --- Contenedor principal --- */
export const WorkerListContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

/* --- Formulario --- */
export const WorkerForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 15px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    flex: 1 1 180px;
    font-size: 0.95rem;
  }
`;

/* --- Botones --- */
export const WorkerButton = styled.button<{
  variant?: "add" | "view" | "delete";
}>`
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: background 0.2s ease;

  background: ${({ theme, variant }) =>
    variant === "add"
      ? theme.colors.primary
      : variant === "view"
      ? theme.colors.primaryLight
      : "#d32f2f"};

  &:hover {
    background: ${({ theme, variant }) =>
      variant === "add"
        ? theme.colors.primaryDark
        : variant === "view"
        ? "#8E0000"
        : "#a31818"};
  }
`;

/* --- Tabla de empleados --- */
export const WorkerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};

  th,
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
  }
`;

/* --- Modal --- */
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 25px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary};
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 8px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* --- Galería de fotos --- */
export const PhotoGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
`;

export const Photo = styled.img`
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #eee;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 90px;
    height: 90px;
  }
`;

/* --- Botón cerrar modal --- */
export const CloseButton = styled.button`
  display: block;
  margin: 20px auto 0;
  background: #333;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #000;
  }
`;
