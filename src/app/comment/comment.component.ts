import { KeycloakService } from 'keycloak-angular';
import { PostComment } from '../entities/comment.entity';
import { CommentService } from '../services/comment.service';
import { Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

  @Input() comment: PostComment | undefined;

  constructor (private readonly commentService : CommentService, 
    private keycloakService: KeycloakService, 
    private popupService: PopupService) {}


  likeComment() {
    this.commentService.putLikeComment(this.comment!.id).subscribe(comment => this.comment = comment);
  }

  hasUserLikedComment() {
    let user = this.keycloakService.getUsername();
    return this.comment?.likers.find(u => u == user)
  }

  canDeleteComment() {
    let user = this.keycloakService.getUsername();
    return (this.comment?.author ?? "") == user || this.keycloakService.getUserRoles().includes("Admin")
  }

  removeComment() {
    this.commentService.deleteComment(this.comment!.id).subscribe(
      _ => {
        this.comment = undefined;
        this.popupService.openSuccess("Comment deleted")
      }
    );
  }

}

