import { type FC, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField, List, ListItem } from "@mui/material";
import TaskView from "../TaskView/TaskView";
import {
  createTask,
  readAllTasksByProjectId,
  updateTask,
  deleteTask,
} from "../../helpers/tasks.helper";
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

const ProjectView: FC<ProjectViewProps> = ({
  project,
  handleTitleChange,
  handleProjectUpdate,
  handleProjectRemove,
  handleEndTime,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getAllTasksByProjectId = () => {
    readAllTasksByProjectId(project.id || "")
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
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
        console.error(error);
      });
  };

  const updateName = (taskId: string, newName: string) => {
    const newTasks = [...tasks];
    const updatedTask = newTasks.find((item) => item.id === taskId);
    if (updatedTask) {
      updatedTask.name = newName;
      setTasks(newTasks);
    }
  };

  const saveTask = (task: Task) => {
    updateTask(task.id || "", task)
      .then(() => {
        console.log("Successfly saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeTask = (taskId: string) => {
    deleteTask(taskId)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopTask = (taskId: string) => {
    const newTasks = [...tasks];
    const updatedTask = newTasks.find((item) => item.id === taskId);
    if (updatedTask) {
      const currentTime = formattedDateString();
      const duration =
        parseFormattedDateString(currentTime).getTime() -
        parseFormattedDateString(updatedTask.startTime).getTime();
      handleEndTime(project.id || "", currentTime, duration);
      updatedTask.endTime = currentTime;
      updatedTask.totalTime += duration;
      updatedTask.isRunning = false;
      saveTask(updatedTask);
      setTasks(newTasks);
    }
  };

  const startTask = (task: Task) => {
    if (task.isRunning) stopTask(task.id || "");
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
      projectId: project.id || "",
      name: "",
      startTime: currentDateString,
      endTime: "-",
      totalTime: 0,
      isRunning: true,
    };
    addTask(newTask);
  };

  const getRunningTaskId = () => {
    return tasks.find((task) => task.isRunning);
  };

  const handleStop = () => {
    const task = getRunningTaskId();
    stopTask(task?.id || "");
  };

  return (
    <div className="project-container">
      <ListItem className="list-item">
        <TextField
          className="project-title"
          label="Project Title"
          variant="outlined"
          value={project.title}
          onChange={(e) => handleTitleChange(project.id || "", e.target.value)}
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
          onClick={() => handleProjectRemove(project.id || "")}
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
