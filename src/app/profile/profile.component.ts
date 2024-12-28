import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Post} from '../entities/post.entity';
import {PostService} from '../services/post.service';
import {PostComponent} from '../post/post.component';
import {RouterLink} from '@angular/router';

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
  constructor(private  keycloakService : KeycloakService, private postService : PostService) {
  }

  async ngOnInit(): Promise<void> {
    let user = await this.keycloakService.loadUserProfile(false);
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.postService.getSelfPosts().subscribe(posts => {
      this.posts = posts
    })
  }
}
