import { Component } from '@angular/core';
import {User} from '../entities/user.entity';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: User[] = []

  constructor(private userService: UserService) {
  }

  async ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users
    })
  }

  changeRole(userId: number, event: Event) {
    const newRole = (event.target as HTMLInputElement).value
    this.userService.changeRole(userId, newRole).subscribe();
  }
}
