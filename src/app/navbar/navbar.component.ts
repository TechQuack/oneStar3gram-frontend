import { Component, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  // TODO - récupération de l'information de connexion

  constructor (private readonly keycloak : KeycloakService) {

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

  public profil() {
    // TODO renvoyer un flag d'affichage de la page de profil
  }
}
