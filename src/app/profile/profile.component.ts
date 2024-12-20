import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  username : string | undefined = "";
  email : string | undefined = "";
  firstName : string | undefined = "";
  lastName : string | undefined = "";

  constructor(private  keycloakService : KeycloakService) {
  }

  async ngOnInit(): Promise<void> {
    let user = await this.keycloakService.loadUserProfile(false);
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  async disconnect(): Promise<void> {
    await this.keycloakService.logout();
  }

}
