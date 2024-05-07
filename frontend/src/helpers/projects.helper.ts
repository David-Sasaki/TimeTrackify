import { Project } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_SERVER_URL;

export async function createProject(projectData: Project) {
    const response = await fetch(`${BASE_URL}projects/`, {
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

export async function readAllProjects(): Promise<Project[]> {
    const response = await fetch(`${BASE_URL}projects/`);
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    const projects: Project[] = await response.json();
    return projects;
}

export async function updateProject(projectId: string, projectData: Project) {
    const response = await fetch(`${BASE_URL}projects/${projectId}`, {
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
    const response = await fetch(`${BASE_URL}projects/${projectId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete project ${projectId}`);
    }
}
