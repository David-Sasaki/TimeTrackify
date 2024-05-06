import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField, List, ListItem, ListItemText } from "@mui/material";
import "./ProjectList.css";

interface Project {
  title: string;
  startTime: Date;
  endTime: Date;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = () => {
    const newProject: Project = {
      title: "",
      startTime: new Date(),
      endTime: new Date(),
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const deleteProject = (projectTitle: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.title !== projectTitle)
    );
  };

  const updateTitle = (index: number, newTitle: string) => {
    if (projects.map((project) => project.title).includes(newTitle)) {
      alert(`"${newTitle}" is in the current project titles.`);
    } else {
      const newProjects = [...projects];
      newProjects[index].title = newTitle;
      setProjects(newProjects);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={addProject}>
        Add Project
      </Button>
      <List>
        {projects.map((project, index) => (
          <ListItem className="list-item" key={index}>
            <TextField
              className="project-title"
              label="Project Title"
              variant="outlined"
              value={project.title}
              onChange={(e) => updateTitle(index, e.target.value)}
            />
            <ListItemText
              className="list-item-text"
              disableTypography
              secondary={
                <Box>
                  <Typography variant="body2" color="textPrimary">
                    {`Start Time: ${project.startTime.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`End Time: ${project.endTime.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}`}
                  </Typography>
                </Box>
              }
            />
            <Button variant="outlined" color="primary">
              Start
            </Button>
            <Button variant="outlined" color="primary">
              Stop
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => deleteProject(project.title)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectList;
