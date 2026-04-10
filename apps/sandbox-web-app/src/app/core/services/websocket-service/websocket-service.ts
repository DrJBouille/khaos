import { Injectable } from '@angular/core';
import {Observable, shareReplay, Subject} from "rxjs";
import {Client} from "@stomp/stompjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Client | undefined;

  private wsURL = environment.wsUrl;
  private connected = false;
  private connection$?: Observable<void>;

  connect(): Observable<void> {
    if (!this.connection$) {
      this.connection$ = new Observable<void>(observer => {
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
      }).pipe(
        shareReplay(1)
      );
    }

    return this.connection$;
  }

  subscribe<T>(destination: string, subject: Subject<T>) {
    this.stompClient!.subscribe(destination, (message) => {
      console.log(message.body)
      const event: T = JSON.parse(message.body);
      subject.next(event);
    });
  }

  send<T>(destination: string, event: T) {
    this.stompClient!.publish({
      destination: destination,
      body: JSON.stringify(event)
    });
  }
}
