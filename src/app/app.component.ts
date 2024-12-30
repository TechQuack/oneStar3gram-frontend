import { KeycloakBearerInterceptor } from 'keycloak-angular';
import { KeycloakProfile } from './../../node_modules/keycloak-js/lib/keycloak.d';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NgToastModule } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgToastModule],
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
