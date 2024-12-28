import { Component, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import {Router, RouterLink} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() id: number = 0;
  isAdmin: boolean = false;

  post: Post | null = null;

  constructor(private postService: PostService, private keycloackService: KeycloakService) {}


  async ngOnInit() {
    this.postService.getPost(this.id).subscribe(post => this.post = post);
    this.isAdmin = this.keycloackService.getUserRoles().includes("Admin");
  }

  deletePost() {
    if (this.isAdmin) {
      this.postService.deletePost(this.id).subscribe(() => {
        window.location.reload();
      });
    }
  }

}
