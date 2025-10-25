import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;

/*
function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;

*/
