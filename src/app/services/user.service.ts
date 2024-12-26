import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import {User} from '../entities/user.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private keycloakService: KeycloakService) { }

  getUsers(): Observable<User[]> {
    const token =  this.keycloakService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<User[]>('https://proxy-onestar3gram:8080/admin/realms/OneStar3gram/users',
      {headers});
  }

  public hasRole(role: string): boolean {
      return this.keycloakService.isUserInRole(role)
  }

}
