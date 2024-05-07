from pydantic import BaseModel
from typing import List

# Project model
class Project(BaseModel):
    id: str = None
    title: str
    startTime: str
    endTime: str
    totalTime: int

# Task model
class Task(BaseModel):
    id: str = None
    projectId: str
    name: str
    startTime: str
    endTime: str
    totalTime: int
    isRunning: bool
