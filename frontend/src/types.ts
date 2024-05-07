export interface Project {
    id?: string;
    title: string;
    startTime: string;
    endTime: string;
    totalTime: number;
}

export interface Task {
    id?: string;
    projectId: string;
    name: string;
    startTime: string;
    endTime: string;
    totalTime: number;
    isRunning: boolean;
}
