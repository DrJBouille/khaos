import { Route } from '@angular/router';
import {Home} from "./features/home/home";
import {Tasks} from "./features/tasks/tasks";
import {UserResolver} from "./core/services/user-service/user-resolver";

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: Home, resolve: { user: UserResolver } },
  { path: "tasks", component: Tasks, resolve: { user: UserResolver } },
];
