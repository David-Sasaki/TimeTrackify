import { Project } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_SERVER_URL || "http://localhost:8000/";

export const createProject = async (projectData: Project) => {
    const response = await fetch(`${BASE_URL}projects/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    if (!response.ok) {
        throw new Error('Failed to create a project');
    }
    return await response.json();
}

export const readAllProjects = async (): Promise<Project[]> => {
    const response = await fetch(`${BASE_URL}projects/`);
    if (!response.ok) {
        throw new Error('Failed to read projects');
    }
    const projects: Project[] = await response.json();
    return projects;
}

export const updateProject = async (projectId: string, projectData: Project) => {
    const response = await fetch(`${BASE_URL}projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    if (!response.ok) {
        throw new Error(`Failed to update a project ${projectId}`);
    }
    return await response.json();
}

export const deleteProject = async (projectId: string) => {
    const response = await fetch(`${BASE_URL}projects/${projectId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete a project ${projectId}`);
    }
}
