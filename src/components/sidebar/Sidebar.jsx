import React from "react";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Asistencia</h2>
      <ul>
        <li>Inicio</li>
        <li>Empleados</li>
        <li>Biometría</li>
        <li>Reportes</li>
        <li>Configuración</li>
      </ul>
    </div>
  );
}

export default Sidebar;
