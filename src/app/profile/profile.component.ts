import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Post} from '../entities/post.entity';
import {PostService} from '../services/post.service';
import {PostComponent} from '../post/post.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PostComponent,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  username : string | undefined = "";
  email : string | undefined = "";
  firstName : string | undefined = "";
  lastName : string | undefined = "";
  posts : Post[] = []
  constructor(private  keycloakService : KeycloakService, private postService : PostService,
              private userService: UserService, private route: ActivatedRoute,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      let username =  params['username'];
      this.loadProfile(username)
      this.postService.getUserPosts(username).subscribe(posts => {
        this.posts = posts
      })
    })
  }

  loadProfile(username: string | null) {
    this.userService.getUserByUsername(username).subscribe(users => {
      if (users == null || users.length == 0) {
        this.router.navigate(['/']).then();
        return
      }
      let user = users[0]
      this.username = user.username;
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    })
  }
}
