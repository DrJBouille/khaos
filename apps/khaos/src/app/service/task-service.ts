import { apiCall } from './axios-api-call';
import {TaskResponse} from "./data/TaskReponse";
import {TaskDTO} from "./data/TaskDTO";

export const runTask = (data: TaskDTO) => apiCall<TaskResponse>('post', '/tasks', data);
export const getTaskByID = (id: string) => apiCall<TaskResponse>('get', `/tasks/${id}`);
