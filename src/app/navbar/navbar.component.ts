import { Router, RouterLink } from '@angular/router';
import { Component, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { KeycloakProfile } from 'keycloak-js';
import {environment} from '../../environments/environment';

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

  isAdmin: boolean = false;
  username: string | undefined = '';

  constructor (private readonly keycloak : KeycloakService, private router: Router) {}

  async ngOnInit() {
    this.isLogged = this.keycloak.isLoggedIn();
    this.isAdmin = this.keycloak.getUserRoles().includes("Admin");
    if (this.isLogged) {
      this.user = await this.keycloak.loadUserProfile();
      this.username = this.user.username;
    }
  }

  isOnPage(page:String) {
    return this.router.url == page;
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(environment.homePage);
  }

  public register() {
    this.keycloak.register();
  }
}
