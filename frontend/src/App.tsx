import { type FC } from "react";
import ProjectListView from "./components/ProjectListView/ProjectListView";
import "./App.css";

const App: FC = () => {
  return (
    <div className="app-container">
      <ProjectListView />
    </div>
  );
};

export default App;
