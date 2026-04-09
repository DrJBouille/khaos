import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIcon} from "@ng-icons/core";
import Keycloak from "keycloak-js";
import {ConfirmDialog} from "./shared/dialog/confirm-dialog/confirm-dialog";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "./core/services/user-service/user-service";
import {Subscription} from "rxjs";

@Component({
  imports: [RouterModule, FormsModule, NgIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected title = 'Sandbox';

  private dialog = inject(MatDialog);
  private keycloak = inject(Keycloak);
  private userService = inject(UserService);

  private userSubscription: Subscription | undefined;
  protected user: KhaosUser | undefined;

  protected routes = [
    {link: "/editor", icon: "heroHome", name: "Home"},
    {link: "/tasks", icon: "heroArchiveBox", name: "Tasks"},
  ];

  ngOnInit() {
    this.userSubscription = this.userService.me().subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

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
}
