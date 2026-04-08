import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable, shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private httpURL = `${environment.apiUrl}/users`;

  private user$?: Observable<KhaosUser>;

  me(): Observable<KhaosUser> {
    if (!this.user$) {
      this.user$ = this.http.get<KhaosUser>(`${this.httpURL}/me`).pipe(
        shareReplay(1)
      );
    }
    return this.user$;
  }
}
