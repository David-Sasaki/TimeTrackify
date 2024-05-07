import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, CircularProgress } from "@material-ui/core";

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
}));

const Clock: React.FC = () => {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsRunning(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.clockText}>
        Current Time: {time.toLocaleTimeString()}
      </Typography>
      {isRunning ? (
        <Typography variant="body1">Clock is running</Typography>
      ) : (
        <Typography variant="body1">Clock is stopped</Typography>
      )}
      {!isRunning && <CircularProgress />}
    </div>
  );
};

export default Clock;
