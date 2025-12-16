import React, { useMemo, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  HeaderContainer,
  DashboardHeader,
  UserBlock,
  UserAvatar,
  UserDetails,
  LogoutButton,
  ActionsWrapper,
  MobileMenuButton,
  MobileMenu,
  MobileLogoutButton,
} from "./Header.styles";

const getInitials = (name?: string, lastName?: string) => {
  const firstInitial = name?.trim().charAt(0) ?? "";
  const secondInitial = lastName?.trim().charAt(0) ?? "";
  const fallback = (name ?? "Administrador").trim().charAt(0);
  return (firstInitial + secondInitial || fallback || "A").toUpperCase();
};

const Header: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = useMemo(
    () => getInitials(user?.nombres, user?.apellidos),
    [user?.nombres, user?.apellidos]
  );

  const fullName = `${user?.nombres ?? ""} ${user?.apellidos ?? ""}`.trim();

  return (
    <HeaderContainer>
      <DashboardHeader>
        <UserBlock>
          <UserAvatar>{initials}</UserAvatar>
          <UserDetails>
            <h2>
              Bienvenido, <span>{fullName || "Administrador"}</span>
            </h2>
            <p>{user?.email}</p>
          </UserDetails>
        </UserBlock>

        <ActionsWrapper>
          <LogoutButton onClick={logout}>Cerrar sesión</LogoutButton>
          <MobileMenuButton onClick={() => setMobileMenuOpen((prev) => !prev)}>
            ☰
          </MobileMenuButton>
        </ActionsWrapper>
      </DashboardHeader>

      {mobileMenuOpen && (
        <MobileMenu>
          <p>{fullName || "Administrador"}</p>
          <p>{user?.email}</p>
          <MobileLogoutButton onClick={logout}>Cerrar sesión</MobileLogoutButton>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
