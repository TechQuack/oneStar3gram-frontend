import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import {User} from '../entities/user.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, map, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.keycloakUrl + 'users').pipe(
      map(users => users.filter(user => user.username !== environment.serviceAccountUsername))
    );
  }

  hasRole(userId: number, role: string): Observable<boolean> {
    return this.getUserRole(userId).pipe(
      map(userRole => userRole === role)
    );
  }

  deleteUser(userId: number) {
    const deleteUrl = environment.keycloakUrl + 'users/'
      + userId
    return this.http.delete(deleteUrl)
  }

  changeRole(userId: number, role: string): Observable<object> {
    this.removeRoles(userId, role)
    return new Observable(observer => {
      const roleUrl = environment.keycloakUrl + 'users/'
        + userId + '/role-mappings/realm'
      if (role !== 'None') {
        this.getRoleByName(role).subscribe({
          next: (newRole: object) => {
            const rolePayload = [newRole];
            this.http.post(roleUrl, rolePayload).subscribe({
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
      const roleUrl = environment.keycloakUrl + 'users/'
        + userId + '/role-mappings/realm'
      return this.http.get<any[]>(roleUrl).pipe(
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

  getUserByUsername(username: string | null): Observable<any> {
    if (username === environment.serviceAccountUsername) {
      return of(null);
    }
    const url  =environment.keycloakUrl + 'users?username=' + username
    return this.http.get(url);
  }

  private getRoleByName(roleName: string): Observable<object> {
    const url = environment.keycloakUrl + 'roles/' + roleName;
    return this.http.get(url);
  }

  private removeRoles(userId: number, role: string): void {
    const rolesToRemoveNames = this.getRolesToRemove(role)
    const rolesToRemove = forkJoin(rolesToRemoveNames.map(role => this.getRoleByName(role)))
    rolesToRemove.subscribe({
      next: (rolesToRemove: any[]) => {
        const roleUrl = environment.keycloakUrl + 'users/'
          + userId + '/role-mappings/realm'
        this.http.delete(roleUrl, {body: rolesToRemove}).subscribe()
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
