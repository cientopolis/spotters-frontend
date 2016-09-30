import { Task } from './task';

export interface Workflow {
    id: number;
    name: boolean;
    tasks: Task[];
    createdAt: Date;
}