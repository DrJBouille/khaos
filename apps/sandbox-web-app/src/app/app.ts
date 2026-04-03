import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIcon} from "@ng-icons/core";

@Component({
  imports: [RouterModule, FormsModule, NgIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Sandbox';

  protected routes = [
    {link: "/home", icon: "heroHome", name: "Home"},
    {link: "/tasks", icon: "heroArchiveBox", name: "Tasks"},
  ]
}
