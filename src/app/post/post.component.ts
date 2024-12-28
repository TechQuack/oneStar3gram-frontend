import { Component, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() id: number = 0;

  post: Post | null = null;

  constructor(private postService: PostService, private keycloakService : KeycloakService) {}


  async ngOnInit() {
    this.postService.getPost(this.id).subscribe(post => this.post = post)
  }

  hasUserLikedPost() {
    let user = this.keycloakService.getUsername();
    return this.post?.likers.find(u => u == user)
  }

  likePost() {
    this.postService.likePost(this.id).subscribe(post => this.post = post)
  }

}
