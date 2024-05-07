from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pymongo.collection import ReturnDocument
from typing import List
from api.models import Task
from db.mongodb import tasks_collection

router = APIRouter()

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: Task):
    new_task = jsonable_encoder(task)
    new_task_id = tasks_collection.insert_one(new_task).inserted_id
    created_task = tasks_collection.find_one({"_id": new_task_id})
    created_task["id"] = str(new_task_id)
    return created_task

@router.get("/{project_id}", response_model=List[Task])
def read_all_tasks_by_project_id(project_id: str):
    all_tasks = list(tasks_collection.find({"projectId": project_id}))
    if all_tasks:
        for task in all_tasks:
            task['id'] = str(task['_id'])
        return all_tasks
    else:
        return []

@router.put("/{task_id}", response_model=Task)
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

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    delete_result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"task {task_id} not found")
