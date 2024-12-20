import { CommonModule } from '@angular/common';
import { CommentService } from './../services/comment.service';
import { Component, Input } from '@angular/core';
import { CommentComponent } from "../comment/comment.component";

@Component({
  selector: 'app-list-comment',
  standalone: true,
  imports: [CommonModule, CommentComponent],
  templateUrl: './list-comment.component.html',
  styleUrl: './list-comment.component.scss'
})
export class ListCommentComponent {
  @Input() idPost: number = 0;

  comments : any[] = []

  constructor (readonly commentService : CommentService) { }

  async ngOnInit() {
    this.commentService.getPostComments(this.idPost).subscribe(comments => this.comments = comments)
  }

}
