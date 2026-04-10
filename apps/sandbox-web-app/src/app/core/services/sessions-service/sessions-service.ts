import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {Client} from "@stomp/stompjs";
import {TaskResultEvent} from "../../../shared/types/tasks/TaskResultEvent";

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private http = inject(HttpClient);
  private stompClient: Client | undefined;

  private httpURL = `${environment.apiUrl}/sessions`;

  private wsURL = environment.wsUrl;
  private connected = false;

  getMySession() {
    return this.http.get<Session>(this.httpURL + "/me");
  }

  createSession(sessionRequest: SessionRequest) {
    return this.http.post<Session>(this.httpURL, sessionRequest);
  }

  updateSession(id: string, sessionRequest: SessionRequest) {
    return this.http.put<Session>(this.httpURL + `/${id}`, sessionRequest)
  }

  toggleSessions(id: string) {
    return this.http.put<Session>(this.httpURL + `/toggle/${id}`, {});
  }

  getSession(id: string) {
    return this.http.get<Session>(this.httpURL + `/${id}`);
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

  subscribeToSession(sessionId: string, subject: Subject<TaskResultEvent>) {
    this.stompClient!.subscribe(`/topic/session/${sessionId}`, (message) => {
      const event: TaskResultEvent = JSON.parse(message.body);
      subject.next(event);
    });
  }

  sendChange(event: SessionUpdateEvent) {
    this.stompClient!.publish({
      destination: `/app/change/${event.id}`,
      body: JSON.stringify(event)
    });
  }
}
