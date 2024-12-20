import { KeycloakBearerInterceptor } from 'keycloak-angular';
import { KeycloakProfile } from './../../node_modules/keycloak-js/lib/keycloak.d';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'OneStar3gram-front';
  public isLogged = false;
  public user : KeycloakProfile | null = null;

  loadProfile() {
    alert("mon profil a été cliqué")
  }
}
