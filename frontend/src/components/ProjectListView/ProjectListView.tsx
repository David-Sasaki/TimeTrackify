import { type FC, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Box, List } from "@mui/material";
import ProjectView from "../ProjectView/ProjectView";
import { Project } from "../../types";
import {
  createProject,
  readAllProjects,
  updateProject,
  deleteProject,
} from "../../helpers/projects.helper";
import { formattedDateString } from "../../utils";
import "./ProjectListView.css";

const ProjectListView: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProjects = () => {
    readAllProjects()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const addProject = () => {
    const currentDateString: string = formattedDateString();
    const newProject: Project = {
      title: "New Project",
      startTime: currentDateString,
      endTime: currentDateString,
      totalTime: 0,
    };
    createProject(newProject)
      .then((newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateTitle = (projectId: string, newTitle: string) => {
    const newProjects = [...projects];
    const updatedProject = newProjects.find((item) => item.id === projectId);
    if (updatedProject !== undefined) {
      updatedProject.title = newTitle;
      setProjects(newProjects);
    }
  };

  const saveProject = (project: Project) => {
    updateProject(project.id || "", project)
      .then(() => {
        console.log("Successfully saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeProject = (projectId: string) => {
    deleteProject(projectId)
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateEndTime = (
    projectId: string,
    newEndTime: string,
    duration: number
  ) => {
    const newProjects = [...projects];
    const updatedProject = newProjects.find((item) => item.id === projectId);
    if (updatedProject !== undefined) {
      updatedProject.endTime = newEndTime;
      updatedProject.totalTime += duration;
      saveProject(updatedProject);
      setProjects(newProjects);
    }
  };

  return (
    <Box className="project-list-container">
      <Button
        className="add-project-button"
        variant="contained"
        onClick={addProject}
      >
        Add Project
      </Button>
      <List className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <ProjectView
              project={project}
              handleTitleChange={updateTitle}
              handleProjectUpdate={saveProject}
              handleProjectRemove={removeProject}
              handleEndTime={updateEndTime}
            />
          </li>
        ))}
      </List>
    </Box>
  );
};

export default ProjectListView;
