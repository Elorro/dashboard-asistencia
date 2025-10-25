import React, { useState, useEffect } from "react";
import "./sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={`sidebar ${isMobile && !open ? "" : "open"}`}>
        <h2>Mi Dashboard</h2>
        <ul>
          <li>
            <a href="#metrics">Métricas</a>
          </li>
          <li>
            <a href="#grafico">Asistencias</a>
          </li>
        </ul>
      </div>
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: 15,
            left: 15,
            zIndex: 1100,
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}
    </>
  );
}

export default Sidebar;
