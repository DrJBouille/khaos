import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../../shared/types/Task";
import {TaskRequest} from "../../shared/types/TaskRequest";
import {Observable, Subject} from "rxjs";
import {TaskResultEvent} from "../../shared/types/TaskResultEvent";
import {Client} from "@stomp/stompjs";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private stompClient: Client | undefined;

  private httpURL = 'http://localhost:8080/api/tasks';
  private wsURL = 'ws://localhost:8080/ws';
  private connected = false;

  createTask(taskRequest: TaskRequest) {
    return this.http.post<Task>(this.httpURL, taskRequest);
  }

  getTask(id: string) {
    return this.http.get<Task>(this.httpURL + "/" + id);
  }

  getTasks() {
    return this.http.get<Task[]>(this.httpURL);
  }


  connect(): Observable<void> {
    return new Observable(observer => {
      if (this.connected) {
        observer.next();
        observer.complete();
        return;
      }

      this.stompClient = new Client({
        brokerURL: this.wsURL,
        onConnect: () => {
          this.connected = true;
          observer.next();
          observer.complete();
        },
        onDisconnect: () => { this.connected = false; },
        onStompError: (frame) => observer.error(frame),
      });
      this.stompClient.activate();
    });
  }

  subscribeToTask(taskId: string, subject: Subject<TaskResultEvent>) {
    this.stompClient!.subscribe(`/topic/tasks/${taskId}`, (message) => {
      const event: TaskResultEvent = JSON.parse(message.body);
      subject.next(event);
    });
  }

  subscribeToAllTasks(subject: Subject<TaskResultEvent>) {
    this.stompClient!.subscribe(`/topic/tasks`, (message) => {
      const event: TaskResultEvent = JSON.parse(message.body);
      subject.next(event);
    });
  }

  closeConnection() {
    this.stompClient?.deactivate();
  }
}
