import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgOptimizedImage,
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

  @Output() profileEvent = new EventEmitter<void>();

  constructor (private readonly keycloak : KeycloakService) {}

  public async ngOnInit() {
    this.isLogged = await this.keycloak.isLoggedIn();

    if (this.isLogged) {
      this.user = await this.keycloak.loadUserProfile();
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

  public profile() {
    this.profileEvent.emit();
  }
}
