import { CommonModule } from '@angular/common';
import { CommentService } from './../services/comment.service';
import { Component, Input } from '@angular/core';
import { CommentComponent } from "../comment/comment.component";
import { PostComment } from '../entities/comment.entity';

@Component({
  selector: 'app-list-comment',
  standalone: true,
  imports: [CommonModule, CommentComponent],
  templateUrl: './list-comment.component.html',
  styleUrl: './list-comment.component.scss'
})
export class ListCommentComponent {
  @Input() comments : PostComment[] = []
}
