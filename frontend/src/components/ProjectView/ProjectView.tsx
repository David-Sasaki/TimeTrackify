import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField, List, ListItem, ListItemText } from "@mui/material";
import TaskView from "../TaskView/TaskView";
import {
  createTask,
  readAllTasksByProjectId,
  updateTask,
  deleteTask,
} from "../../api";
import { Project, Task } from "../../types";
import { formattedDateString, parseFormattedDateString } from "../../utils";
import "./ProjectView.css";

interface ProjectViewProps {
  project: Project;
  handleTitleChange: (projectId: string, newTitle: string) => void;
  handleProjectUpdate: (project: Project) => void;
  handleProjectRemove: (projectId: string) => void;
  handleEndTime: (
    projectId: string,
    newEndTime: string,
    duration: number
  ) => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  handleTitleChange,
  handleProjectUpdate,
  handleProjectRemove,
  handleEndTime,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getAllTasksByProjectId = () => {
    readAllTasksByProjectId(project.id as string)
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error read all tasks by projectId:", error);
      });
  };

  useEffect(() => {
    getAllTasksByProjectId();
  }, []);

  const addTask = (newTask: Task) => {
    createTask(newTask)
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response]);
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const updateName = (taskId: string, newName: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newTask: Task = {
          id: task.id,
          projectId: task.projectId,
          name: newName,
          startTime: task.startTime,
          endTime: task.endTime,
          totalTime: task.totalTime,
          isRunning: task.isRunning,
        };
        return newTask;
      } else {
        return task;
      }
    });
    setTasks(newTasks);
  };

  const saveTask = (task: Task) => {
    updateTask(task.id as string, task).catch((error) => {
      console.error("Error updating task:", error);
    });
  };

  const removeTask = (taskId: string) => {
    deleteTask(taskId)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const stopTask = (taskId: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const currentTime = formattedDateString();
        const duration =
          parseFormattedDateString(currentTime).getTime() -
          parseFormattedDateString(task.startTime).getTime();
        handleEndTime(project.id as string, currentTime, duration);
        const newTask: Task = {
          id: task.id,
          projectId: task.projectId,
          name: task.name,
          startTime: task.startTime,
          endTime: currentTime,
          totalTime: task.totalTime + duration,
          isRunning: false,
        };
        saveTask(newTask);
        return newTask;
      } else {
        return task;
      }
    });
    setTasks(newTasks);
  };

  const startTask = (task: Task) => {
    if (task.isRunning) stopTask(task.id as string);
    const newTask: Task = {
      projectId: task.projectId,
      name: task.name,
      startTime: formattedDateString(),
      endTime: "-",
      totalTime: 0,
      isRunning: true,
    };
    addTask(newTask);
  };

  const handleStart = () => {
    const currentDateString: string = formattedDateString();
    const newTask: Task = {
      projectId: project.id as string,
      name: "",
      startTime: currentDateString,
      endTime: "-",
      totalTime: 0,
      isRunning: true,
    };
    addTask(newTask);
  };

  const getRunningTaskId = () => {
    return tasks.find((task) => task.isRunning === true);
  };

  const handleStop = () => {
    const task = getRunningTaskId();
    stopTask(task?.id as string);
  };

  return (
    <div className="project-container">
      <ListItem className="list-item">
        <TextField
          className="project-title"
          label="Project Title"
          variant="outlined"
          value={project.title}
          onChange={(e) =>
            handleTitleChange(project.id as string, e.target.value)
          }
          onBlur={(_) => handleProjectUpdate(project)}
        />
        <Box className="project-info">
          <Typography
            className="project-info-item"
            variant="body1"
            color="primary"
          >
            Total running time: {Math.floor(project.totalTime / 1000)} seconds
          </Typography>
          <Typography
            className="project-info-item"
            variant="body2"
            color="textPrimary"
          >
            {`Start Time: ${project.startTime}`}
          </Typography>
          <Typography
            className="project-info-item"
            variant="body2"
            color="textSecondary"
          >
            {`End Time: ${project.endTime}`}
          </Typography>
        </Box>
        {getRunningTaskId() ? (
          <Button disabled={true}>Start</Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={handleStart}>
            Start
          </Button>
        )}
        {getRunningTaskId() ? (
          <Button variant="outlined" color="primary" onClick={handleStop}>
            Stop
          </Button>
        ) : (
          <Button disabled={true}>Stop</Button>
        )}
        <Button
          className="project-action-button"
          variant="outlined"
          color="secondary"
          onClick={() => handleProjectRemove(project.id as string)}
        >
          Delete
        </Button>
      </ListItem>
      <List className="task-list">
        {tasks.map((task) => (
          <ListItem key={task.id} className="task-item">
            <TaskView
              task={task}
              handleTaskChange={updateName}
              handleTaskUpdate={saveTask}
              handleTaskRemove={removeTask}
              handleTaskStarting={startTask}
              handleTaskStopping={stopTask}
              isTaskRunning={getRunningTaskId}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProjectView;
