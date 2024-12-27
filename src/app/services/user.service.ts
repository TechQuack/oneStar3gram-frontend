import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import {User} from '../entities/user.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  getUsers(): Observable<User[]> {
    const token =  this.keycloakService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<User[]>(environment.keycloakUrl + 'users', {headers});
  }

  public hasRole(role: string): boolean {
      return this.keycloakService.isUserInRole(role)
  }

  public changeRole(userId: number, role: string): Observable<any> {
    this.removeRoles(userId, role)
    return new Observable(observer => {
      const token = this.keycloakService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const roleUrl = environment.keycloakUrl + 'users/'
        + userId + '/role-mappings/realm'
      if (role !== 'None') {
        this.getRoleByName(role).subscribe({
          next: (newRole: any) => {
            const rolePayload = [newRole];
            this.http.post(roleUrl, rolePayload, {headers}).subscribe({
              next: response => {
                observer.next(response);
                observer.complete();
              },
            });
          },
        });
      }
    });
  }




  private getRoleByName(roleName: string): Observable<any> {
    const url = environment.keycloakUrl + 'roles/' + roleName;
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(url, { headers });
  }

  private removeRoles(userId: number, role: string) {
    const rolesToRemoveNames = this.getRolesToRemove(role)
    const rolesToRemove = forkJoin(rolesToRemoveNames.map(role => this.getRoleByName(role)))
    rolesToRemove.subscribe({
      next: (rolesToRemove: any[]) => {
        const roleUrl = environment.keycloakUrl + 'users/'
          + userId + '/role-mappings/realm'

        const token = this.keycloakService.getToken();
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        this.http.delete(roleUrl, {headers, body: rolesToRemove}).subscribe()
      }
    })
  }

  private getRolesToRemove(currentRole: string): any[] {
    switch (currentRole) {
      case 'Admin':
        return ['Privileged'];
      case 'Privileged':
        return ['Admin'];
      case 'None':
        return ['Admin', 'Privileged'];
      default:
        return [];
    }
  }
}
