import { Component, inject, Input } from '@angular/core';
import { PostComponent } from "../post/post.component";
import { ListCommentComponent } from "../list-comment/list-comment.component";
import { FormCommentComponent } from "../form-comment/form-comment.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostComponent, ListCommentComponent, FormCommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  
  id: number = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = +params['id'];
    });
  }
}
