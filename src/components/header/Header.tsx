import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  HeaderContainer,
  DashboardHeader,
  UserInfo,
  LogoutButton,
} from "./HeaderStyles";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <HeaderContainer>
      <DashboardHeader>
        <UserInfo>
          <h2>
            Bienvenido,{" "}
            <span className="username">
              {user?.firstName} {user?.lastName}
            </span>
          </h2>
          <p className="user-email">{user?.email}</p>
        </UserInfo>
        <LogoutButton onClick={logout}>Cerrar sesión</LogoutButton>
      </DashboardHeader>
    </HeaderContainer>
  );
};

export default Header;
