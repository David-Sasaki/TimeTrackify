import React from "react";
import { Task } from "../../types";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, TextField, ListItem, ListItemText } from "@mui/material";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./TaskView.css";

interface TaskViewProps {
  task: Task;
  handleTaskChange: (taskId: string, newName: string) => void;
  handleTaskUpdate: (task: Task) => void;
  handleTaskRemove: (taskId: string) => void;
  handleTaskStarting: (task: Task) => void;
  handleTaskStopping: (taskId: string) => void;
  isTaskRunning: () => Task | undefined;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100vh",
  },
  clockText: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    width: 48, // Set the desired width
    height: 48, // Set the desired height
  },
}));

const TaskView: React.FC<TaskViewProps> = ({
  task,
  handleTaskChange,
  handleTaskUpdate,
  handleTaskRemove,
  handleTaskStarting,
  handleTaskStopping,
  isTaskRunning,
}) => {
  const classes = useStyles();

  const handleStart = () => {
    handleTaskStarting(task);
  };

  const handleStop = () => {
    handleTaskStopping(task.id as string);
  };

  return (
    <div>
      <ListItem key={task.id as string}>
        <TextField
          label="Task Name"
          variant="outlined"
          value={task.name}
          onChange={(e) => handleTaskChange(task.id as string, e.target.value)}
          onBlur={(_) => handleTaskUpdate(task)}
        />
        <ListItemText
          className="list-item-text"
          disableTypography
          primary={
            <Typography variant="body1" color="primary">
              Total running time: {Math.floor(task.totalTime / 1000)} seconds
            </Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="textPrimary">
                {`Start Time: ${task.startTime}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {`End Time: ${task.endTime}`}
              </Typography>
            </Box>
          }
        />
        {isTaskRunning() ? (
          <Button disabled={true}>Start</Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={handleStart}>
            Start
          </Button>
        )}
        {isTaskRunning() === task ? (
          <Button variant="outlined" color="primary" onClick={handleStop}>
            Stop
          </Button>
        ) : (
          <Button disabled={true}>Stop</Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleTaskRemove(task.id as string)}
        >
          Delete
        </Button>
        {task.isRunning ? (
          <CircularProgress size={48} />
        ) : (
          <CheckCircleIcon
            color="primary"
            fontSize="large"
            className={classes.icon}
          />
        )}
      </ListItem>
    </div>
  );
};

export default TaskView;
