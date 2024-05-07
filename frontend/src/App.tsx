import React from "react";
import ProjectListView from "./components/ProjectListView/ProjectListView";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <ProjectListView />
    </div>
  );
};

export default App;
