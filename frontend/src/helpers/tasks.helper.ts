import { Task } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_SERVER_URL || "http://localhost:8000/";

export const createTask = async (taskData: Task) => {
    const response = await fetch(`${BASE_URL}tasks/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error('Failed to create a task');
    }
    return await response.json();
}

export const readAllTasksByProjectId = async (projectId: string): Promise<Task[]> => {
    const response = await fetch(`${BASE_URL}tasks/${projectId}`);
    if (!response.ok) {
        throw new Error('Failed to read tasks');
    }
    const tasks: Task[] = await response.json();
    return tasks;
}

export const updateTask = async (taskId: string, taskData: Task) => {
    const response = await fetch(`${BASE_URL}tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error(`Failed to update a task ${taskId}`);
    }
    return await response.json();
}

export const deleteTask = async (taskId: string) => {
    const response = await fetch(`${BASE_URL}tasks/${taskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete a task ${taskId}`);
    }
}
