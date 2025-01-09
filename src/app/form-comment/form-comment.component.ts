import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { PostComment } from '../entities/comment.entity';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-form-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-comment.component.html',
  styleUrl: './form-comment.component.scss'
})
export class FormCommentComponent {
  @Input() idPost: number = 0;

  @Output() newComment: EventEmitter<PostComment> = new EventEmitter()

  commentForm : FormGroup = new FormGroup({
    value : new FormControl(""),
  });

  constructor (readonly commentService : CommentService, private popupService : PopupService) { }

  submit() {
    this.commentService.postComment(this.idPost, this.commentForm.value.value).subscribe(c => {
      this.newComment.emit(c);
      this.popupService.openSuccess("Comment added");
      this.commentForm.reset();
    });
  }
}
