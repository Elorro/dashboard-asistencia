import styled from "styled-components";

export const WorkerListContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

export const SearchInput = styled.input`
  flex: 1 1 260px;
  min-width: 220px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.borderSoft};
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const WorkerButton = styled.button<{
  variant?: "view" | "delete" | "primary";
}>`
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: background 0.2s ease;

  background: ${({ theme, variant }) => {
    switch (variant) {
      case "delete":
        return "#d32f2f";
      case "primary":
        return theme.colors.primary;
      default:
        return theme.colors.primaryLight;
    }
  }};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const WorkerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};

  th,
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
  }

  tbody tr:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  @media (max-width: 860px) {
    display: block;
    overflow-x: auto;
  }
`;

export const PhotoCluster = styled.div`
  display: flex;
  gap: 6px;
`;

export const PhotoThumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderSoft};
`;

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
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 18px;

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary};
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 8px;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};

    input {
      padding: 10px;
      border: 1px solid ${({ theme }) => theme.colors.borderSoft};
      border-radius: 8px;
      font-size: 0.95rem;
    }
  }
`;

export const PhotoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
`;

export const Photo = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #eee;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

export const CloseButton = styled.button`
  align-self: flex-end;
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

export const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
`;

export const Subtitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
