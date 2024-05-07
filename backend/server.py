from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from pymongo.collection import ReturnDocument
from bson import ObjectId
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017'))
db = client['TimeTrackify']
projects_collection = db.projects
tasks_collection = db.tasks

# Project
class Project(BaseModel):
    id: str = None
    title: str
    startTime: str
    endTime: str
    totalTime: int
    isRunning: bool

@app.post("/projects/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: Project):
    new_project = jsonable_encoder(project)
    new_project_id = projects_collection.insert_one(new_project).inserted_id
    created_project = projects_collection.find_one({"_id": new_project_id})
    created_project["id"] = str(new_project_id)
    return created_project

@app.get("/projects/{project_id}", response_model=Project)
def read_project(project_id: str):
    project = projects_collection.find_one({"_id": ObjectId(project_id)})
    if project is not None:
        project['id'] = str(project['_id'])
        return project
    raise HTTPException(status_code=404, detail=f"project {project_id} not found")

@app.put("/projects/{project_id}", response_model=Project)
def update_project(project_id: str, project: Project):
    updated_project = projects_collection.find_one_and_update(
        {"_id": ObjectId(project_id)},
        {"$set": jsonable_encoder(project)},
        return_document=ReturnDocument.AFTER
    )
    if updated_project is not None:
        updated_project['id'] = project_id
        return updated_project
    raise HTTPException(status_code=404, detail=f"project {project_id} not found")

@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str):
    delete_result = projects_collection.delete_one({"_id": ObjectId(project_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"project {project_id} not found")

@app.get("/projects/", response_model=List[Project])
def read_all_projects():
    all_projects = list(projects_collection.find({}))
    if all_projects:
        for project in all_projects:
            project['id'] = str(project['_id'])
        return all_projects
    else:
        return []

# Task
class Task(BaseModel):
    id: str = None
    projectId: str
    name: str
    startTime: str
    endTime: str
    totalTime: int
    isRunning: bool

@app.post("/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: Task):
    new_task = jsonable_encoder(task)
    new_task_id = tasks_collection.insert_one(new_task).inserted_id
    created_task = tasks_collection.find_one({"_id": new_task_id})
    created_task["id"] = str(new_task_id)
    return created_task

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: str):
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if task is not None:
        task['id'] = str(task['_id'])
        return task
    raise HTTPException(status_code=404, detail=f"task {task_id} not found")

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task: Task):
    updated_task = tasks_collection.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": jsonable_encoder(task)},
        return_document=ReturnDocument.AFTER
    )
    if updated_task is not None:
        updated_task['id'] = task_id
        return updated_task
    raise HTTPException(status_code=404, detail=f"task {task_id} not found")

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    delete_result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"task {task_id} not found")

@app.get("/project-tasks/{project_id}", response_model=List[Task])
def read_all_tasks_by_project_id(project_id: str):
    all_tasks = list(tasks_collection.find({"projectId": project_id}))
    if all_tasks:
        for task in all_tasks:
            task['id'] = str(task['_id'])
        return all_tasks
    else:
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
