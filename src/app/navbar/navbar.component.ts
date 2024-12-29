import {RouterLink} from '@angular/router';
import { Component, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input({
    required: true
  }) isLogged : boolean = false;


  @Input({
    required: true
  }) user : KeycloakProfile | null = null;

  username: string | undefined = '';
  constructor (private readonly keycloak : KeycloakService) {}

  public async ngOnInit() {
    this.isLogged = this.keycloak.isLoggedIn();

    if (this.isLogged) {
      this.user = await this.keycloak.loadUserProfile();
      this.username = this.user.username;
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  public register() {
    this.keycloak.register();
  }
}
