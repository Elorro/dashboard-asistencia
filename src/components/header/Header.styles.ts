import styled from "styled-components";

export const HeaderContainer = styled.header`
  padding: 20px 24px 20px 80px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  position: sticky;
  top: 0;
  z-index: 900;

  @media (max-width: 1024px) {
    padding-left: 64px;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%;
  gap: 16px;
`;

export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.2rem;
    margin: 0;
  }

  span {
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

  @media (max-width: 600px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  display: none;

  @media (max-width: 600px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const MobileMenu = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: none;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 600px) {
    display: flex;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const MobileLogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
`;
