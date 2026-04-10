import {inject, Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {Observable} from "rxjs";
import {WebsocketService} from "../services/websocket-service/websocket-service";

@Injectable({ providedIn: 'root' })
export class WebsocketResolver implements Resolve<void> {
  private websocketService = inject(WebsocketService)

  resolve(): Observable<void> {
    return this.websocketService.connect();
  }
}
