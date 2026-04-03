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

  createTask(taskRequest: TaskRequest) {
    return this.http.post<Task>(this.httpURL, taskRequest);
  }

  getTask(id: string) {
    return this.http.get<Task>(this.httpURL + "/" + id);
  }

  getTasks() {
    return this.http.get<Task[]>(this.httpURL);
  }

  connect(subject: Subject<TaskResultEvent>): Observable<void> {
    return new Observable(observer => {
      if (!this.stompClient) {
        this.stompClient = new Client({
          brokerURL: this.wsURL,
          onConnect: () => {
            console.log('WS connected');
            observer.next();
            observer.complete();
          },
          onDisconnect: () => subject.complete(),
          onStompError: (frame) => subject.error(frame),
        });
        this.stompClient.activate();
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  subscribeToTask(taskId: string, subject: Subject<TaskResultEvent>) {
    this.stompClient!.subscribe(`/topic/tasks/${taskId}`, (message) => {
      const event: TaskResultEvent = JSON.parse(message.body);
      subject.next(event);
    });
  }

  closeConnection() {
    this.stompClient?.deactivate();
  }
}
