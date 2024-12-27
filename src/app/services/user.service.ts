import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import {User} from '../entities/user.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, map, Observable} from 'rxjs';
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

  hasRole(role: string): boolean {
      return this.keycloakService.isUserInRole(role)
  }

  changeRole(userId: number, role: string): Observable<object> {
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
          next: (newRole: object) => {
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

  getUserRole(userId: number): Observable<string> {
      const token = this.keycloakService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const roleUrl = environment.keycloakUrl + 'users/'
        + userId + '/role-mappings/realm'
      return this.http.get<any[]>(roleUrl, { headers }).pipe(
        map(roles => {
          const roleNames = roles.map(role => role.name)
          if (roleNames.includes('Admin')) {
            return 'Admin'
          } else if (roleNames.includes('Privileged')) {
            return 'Privileged'
          } else {
            return 'None'
          }
        })
      )
  }


  private getRoleByName(roleName: string): Observable<object> {
    const url = environment.keycloakUrl + 'roles/' + roleName;
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(url, { headers });
  }

  private removeRoles(userId: number, role: string): void {
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

  private getRolesToRemove(currentRole: string): string[] {
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
