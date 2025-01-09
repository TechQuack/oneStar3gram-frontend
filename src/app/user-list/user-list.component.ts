import { Component } from '@angular/core';
import {User} from '../entities/user.entity';
import {UserService} from '../services/user.service';
import {FormsModule} from '@angular/forms';
import {forkJoin, map} from 'rxjs';
import {PopupService} from '../services/popup.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: User[] = []
  constructor(private userService: UserService, private popupService: PopupService) {
  }

  async ngOnInit() {
    this.loadUsers()
  }

  changeRole(userId: number, event: Event) {
    const newRole = (event.target as HTMLInputElement).value
    this.userService.changeRole(userId, newRole).subscribe(
      () => this.popupService.openSuccess("user's role changed!")
    );
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(
    () => {
      this.loadUsers()
      this.popupService.openSuccess("User deleted!")
      }
    );

  }

  private loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const roleRequests = users.map((user) =>
          this.userService.getUserRole(user.id).pipe(
            map((role) =>
              ({...user, role}))
          )
        );
        forkJoin(roleRequests).subscribe({
          next: (usersWithRoles: User[]) => {
            this.users = usersWithRoles;
          },
        });
      },
    })
  }
}
