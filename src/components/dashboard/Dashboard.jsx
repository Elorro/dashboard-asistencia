import React from "react";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Resumen General</h2>
      <div className="cards">
        <div className="card">
          <h3>Asistencias Hoy</h3>
          <p>58</p>
        </div>
        <div className="card">
          <h3>Faltas</h3>
          <p>4</p>
        </div>
        <div className="card">
          <h3>Registros Biométricos</h3>
          <p>62</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
