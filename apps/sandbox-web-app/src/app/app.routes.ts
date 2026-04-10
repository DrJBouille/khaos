import { Route } from '@angular/router';
import {Home} from "./features/home/home";
import {Tasks} from "./features/tasks/tasks";
import {UserResolver} from "./core/resolvers/user-resolver";
import {WebsocketResolver} from "./core/resolvers/websocket-resolver";

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/editor', pathMatch: 'full' },
  { path: "editor/:id", component: Home, resolve: { user: UserResolver, ws: WebsocketResolver } },
  { path: "editor", component: Home, resolve: { user: UserResolver, ws: WebsocketResolver } },
  { path: "tasks", component: Tasks, resolve: { user: UserResolver, ws: WebsocketResolver } },
];
