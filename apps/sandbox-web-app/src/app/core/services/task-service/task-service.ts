import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../../../shared/types/tasks/Task";
import {TaskRequest} from "../../../shared/types/tasks/TaskRequest";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private httpURL = `${environment.apiUrl}/tasks`;

  createTask(taskRequest: TaskRequest) {
    return this.http.post<Task>(this.httpURL, taskRequest);
  }

  getTask(id: string) {
    return this.http.get<Task>(this.httpURL + "/" + id);
  }

  getTasks() {
    return this.http.get<Task[]>(this.httpURL);
  }
}
