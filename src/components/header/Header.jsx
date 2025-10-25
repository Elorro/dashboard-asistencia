import React from "react";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <h1>Panel de Control</h1>
      <div className="user-info">
        <img
          src="https://via.placeholder.com/40"
          alt="user"
          className="user-avatar"
        />
        <span>Admin</span>
      </div>
    </header>
  );
}

export default Header;
