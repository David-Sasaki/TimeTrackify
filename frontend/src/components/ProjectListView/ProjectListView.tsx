import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Box, List } from "@mui/material";
import ProjectView from "../ProjectView/ProjectView";
import { Project } from "../../types";
import {
  createProject,
  readAllProjects,
  updateProject,
  deleteProject,
} from "../../api";
import { formattedDateString } from "../../utils";
import "./ProjectListView.css";

const ProjectListView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProjects = () => {
    readAllProjects()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error read all projects:", error);
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
      isRunning: false,
    };
    createProject(newProject)
      .then((newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  const updateTitle = (projectId: string, newTitle: string) => {
    const newProjects = projects.map((project) => {
      if (project.id === projectId) {
        const newProject = project;
        newProject.title = newTitle;
        return newProject;
      } else {
        return project;
      }
    });
    setProjects(newProjects);
  };

  const saveProject = (project: Project) => {
    updateProject(project.id as string, project).catch((error) => {
      console.error("Error updating project:", error);
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
        console.error("Error deleting project:", error);
      });
  };

  const updateEndTime = (
    projectId: string,
    newEndTime: string,
    duration: number
  ) => {
    const newProjects = projects.map((project) => {
      if (project.id === projectId) {
        const newProject: Project = {
          id: project.id,
          title: project.title,
          startTime: project.startTime,
          endTime: newEndTime,
          totalTime: project.totalTime + duration,
          isRunning: project.isRunning,
        };
        return newProject;
      } else {
        return project;
      }
    });
    setProjects(newProjects);
  };

  return (
    <Box>
      <Button variant="contained" onClick={addProject}>
        Add Project
      </Button>
      <List>
        {projects.map((project) => (
          <ProjectView
            project={project}
            handleTitleChange={updateTitle}
            handleProjectUpdate={saveProject}
            handleProjectRemove={removeProject}
            handleEndTime={updateEndTime}
          />
        ))}
      </List>
    </Box>
  );
};

export default ProjectListView;
