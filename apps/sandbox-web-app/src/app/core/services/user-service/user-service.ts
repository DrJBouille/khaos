import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private httpURL = `${environment.apiUrl}/users`;

  private userSubject = new BehaviorSubject<KhaosUser | undefined>(undefined);
  private loaded = false;
  user$ = this.userSubject.asObservable();

  me() {
    if (this.loaded) return this.user$;

    return this.http.get<KhaosUser>(this.httpURL + "/me").pipe(
      tap(user => {
        this.userSubject.next(user);
        this.loaded = true;
      })
    );
  }
}
