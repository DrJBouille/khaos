import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private http = inject(HttpClient);
  private httpURL = `${environment.apiUrl}/sessions`;

  getMySession() {
    return this.http.get<Session>(this.httpURL + "/me");
  }

  createSession(sessionRequest: SessionRequest) {
    return this.http.post<Session>(this.httpURL, sessionRequest);
  }

  updateSession(id: string, sessionRequest: SessionRequest) {
    return this.http.put<Session>(this.httpURL + `/${id}`, sessionRequest)
  }
}
