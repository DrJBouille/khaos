import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIcon} from "@ng-icons/core";
import Keycloak from "keycloak-js";
import {ConfirmDialog} from "./shared/dialog/confirm-dialog/confirm-dialog";
import {MatDialog} from "@angular/material/dialog";

@Component({
  imports: [RouterModule, FormsModule, NgIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Sandbox';

  private dialog = inject(MatDialog);
  private keycloak = inject(Keycloak);

  protected logout() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { message: 'Do you want to logout ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keycloak.logout({ redirectUri: window.location.origin });
      }
    });
  }

  protected routes = [
    {link: "/home", icon: "heroHome", name: "Home"},
    {link: "/tasks", icon: "heroArchiveBox", name: "Tasks"},
  ]
}
