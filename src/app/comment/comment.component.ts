import { PostComment } from '../entities/comment.entity';
import { CommentService } from '../services/comment.service';
import { Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';

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
  @Input() id: number = 0;

  constructor (readonly commentService : CommentService) {}

  comment: PostComment | null = null;

  async ngOnInit() {
    this.commentService.getComment(this.id).subscribe(comment => this.comment = comment)
  }

  toggleLike() {
    // si l'utilisateur a deja liker
    // sinon
    this.likeComment();
  }

  likeComment() {
    this.commentService.putLikeComment(this.id);
  }

  removeComment() {
    this.commentService.deleteComment(this.id);
  }

  // unlikeComment() {
  //   this.commentService.putLikeComment(this.id);
  // }

}

