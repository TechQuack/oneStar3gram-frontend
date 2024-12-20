import { Component, Input } from '@angular/core';
import { PostComponent } from "../post/post.component";
import { ListCommentComponent } from "../list-comment/list-comment.component";
import { FormCommentComponent } from "../form-comment/form-comment.component";

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostComponent, ListCommentComponent, FormCommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  @Input() id: number = 0;
}
