import { Project, Task } from "./types";

export async function createProject(projectData: Project) {
    const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return await response.json();
}

export async function readProject(projectId: string) {
    const response = await fetch(`http://localhost:8000/projects/${projectId}`);
    if (!response.ok) {
        throw new Error(`Failed to read project ${projectId}`);
    }
    return await response.json();
}

export async function updateProject(projectId: string, projectData: Project) {
    const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    if (!response.ok) {
        throw new Error(`Failed to update project ${projectId}`);
    }
    return await response.json();
}

export async function deleteProject(projectId: string) {
    const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete project ${projectId}`);
    }
}

export async function readAllProjects(): Promise<Project[]> {
    const response = await fetch('http://localhost:8000/projects/');
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    const projects: Project[] = await response.json();
    return projects;
}

export async function createTask(taskData: Task) {
    const response = await fetch('http://localhost:8000/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return await response.json();
}

export async function readTask(taskId: string) {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
    if (!response.ok) {
        throw new Error(`Failed to read task ${taskId}`);
    }
    return await response.json();
}

export async function updateTask(taskId: string, taskData: Task) {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error(`Failed to task task ${taskId}`);
    }
    return await response.json();
}

export async function deleteTask(taskId: string) {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete task ${taskId}`);
    }
}

export async function readAllTasksByProjectId(projectId: string): Promise<Task[]> {
    const response = await fetch(`http://localhost:8000/project-tasks/${projectId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const tasks: Task[] = await response.json();
    return tasks;
}
