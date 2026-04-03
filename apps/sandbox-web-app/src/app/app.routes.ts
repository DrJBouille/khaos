import { Route } from '@angular/router';
import {Home} from "./features/home/home";
import {Tasks} from "./features/tasks/tasks";

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: Home },
  { path: "tasks", component: Tasks },
];
