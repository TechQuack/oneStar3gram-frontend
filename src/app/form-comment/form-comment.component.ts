import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { PostComment } from '../entities/comment.entity';

@Component({
  selector: 'app-form-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-comment.component.html',
  styleUrl: './form-comment.component.scss'
})
export class FormCommentComponent {
  @Input() idPost: number = 0;

  commentForm : FormGroup = new FormGroup({
    value : new FormControl(""),
  });

  comment: PostComment | null = null;

  constructor (readonly commentService : CommentService) { }

  submit() {
    this.commentService.putComment(this.idPost, this.commentForm.value.value).subscribe(c => this.comment = c);
  }
}
