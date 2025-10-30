import styled from "styled-components";

/* ==========================
   Header principal
========================== */
export const HeaderContainer = styled.header`
  margin-left: 250px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadow};
  position: sticky;
  top: 0;
  z-index: 900;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

/* ==========================
   Bloque de información
========================== */
export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 18px 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

export const UserInfo = styled.div`
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.3rem;
    margin: 0;
  }

  .username {
    font-weight: 600;
  }

  .user-email {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    margin-top: 4px;
  }
`;

export const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
