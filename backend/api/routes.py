from bson import ObjectId
from db.mongodb import projects_collection, tasks_collection
from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pymongo.collection import ReturnDocument
from typing import List
from api.models import Project, Task

router = APIRouter()

@router.post("/projects/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: Project):
    new_project = jsonable_encoder(project)
    new_project_id = projects_collection.insert_one(new_project).inserted_id
    created_project = projects_collection.find_one({"_id": new_project_id})
    created_project["id"] = str(new_project_id)
    return created_project

@router.get("/projects/", response_model=List[Project])
def read_all_projects():
    all_projects = list(projects_collection.find({}))
    if all_projects:
        for project in all_projects:
            project['id'] = str(project['_id'])
        return all_projects
    else:
        return []

@router.put("/projects/{project_id}", response_model=Project)
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

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str):
    delete_result = projects_collection.delete_one({"_id": ObjectId(project_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"project {project_id} not found")

@router.post("/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: Task):
    new_task = jsonable_encoder(task)
    new_task_id = tasks_collection.insert_one(new_task).inserted_id
    created_task = tasks_collection.find_one({"_id": new_task_id})
    created_task["id"] = str(new_task_id)
    return created_task

@router.get("/tasks/{project_id}", response_model=List[Task])
def read_all_tasks_by_project_id(project_id: str):
    all_tasks = list(tasks_collection.find({"projectId": project_id}))
    if all_tasks:
        for task in all_tasks:
            task['id'] = str(task['_id'])
        return all_tasks
    else:
        return []

@router.put("/tasks/{task_id}", response_model=Task)
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

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    delete_result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"task {task_id} not found")
