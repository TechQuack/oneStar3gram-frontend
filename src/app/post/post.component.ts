import { Component, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { PopupService } from '../services/popup.service';
import {ImageService} from '../services/image.service';
import {VideoService} from '../services/video.service';

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

  constructor(private postService: PostService, private keycloakService :
    KeycloakService, private popupService: PopupService, private imageService: ImageService,
    private videoService: VideoService) {}

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

  downloadMedia() {
    if (this.isAdmin) {
      let media = this.post?.media
      if (media === undefined) {
        this.popupService.openWarning('Media not found!')
        return
      }
      const downloadService = media.video
        ? this.videoService.downloadMedia(media.id)
        : this.imageService.downloadMedia(media.id);

      downloadService.subscribe(blob => {
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = media!.generatedName
        link.click();

        URL.revokeObjectURL(blobUrl);
      })
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
