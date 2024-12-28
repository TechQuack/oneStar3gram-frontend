import { Component } from '@angular/core';
import {User} from '../entities/user.entity';
import {UserService} from '../services/user.service';
import {FormsModule} from '@angular/forms';
import {forkJoin, map} from 'rxjs';

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
  constructor(private userService: UserService) {
  }

  async ngOnInit() {
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

  changeRole(userId: number, event: Event) {
    const newRole = (event.target as HTMLInputElement).value
    this.userService.changeRole(userId, newRole).subscribe();
  }
}
