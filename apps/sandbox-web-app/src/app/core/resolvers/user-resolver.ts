import {inject, Injectable} from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../services/user-service/user-service";

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<KhaosUser> {
  private userService = inject(UserService)

  resolve(): Observable<KhaosUser> {
    return this.userService.me();
  }
}
