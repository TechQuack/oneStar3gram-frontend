import { Component, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { Router, RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() post: Post | null = null;
  isAdmin: boolean = false;

  constructor(private postService: PostService, private keycloakService : KeycloakService, private popupService: PopupService) {}

  hasUserLikedPost() {
    if (!this.keycloakService.isLoggedIn()) {
      return false;
    }
    let user = this.keycloakService.getUsername();
    return this.post?.likers.find(u => u == user)
  }

  likePost() {
    this.postService.likePost(this.post!.id).subscribe(post => this.post = post)
  }

   ngOnInit() {
    this.isAdmin = this.keycloakService.getUserRoles().includes("Admin");
  }

  deletePost() {
    if (this.isAdmin) {
      this.postService.deletePost(this.post!.id).subscribe(() => {
        this.post = null;
        this.popupService.openSuccess("Post deleted")
      });
    }
  }

  public toggle(id : number) {
    var x = document.getElementById("admin-actions-" + id);
    if(x == null) {
      return;
    }
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

}
