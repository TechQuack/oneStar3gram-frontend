import { Component, inject, Input } from '@angular/core';
import { PostComponent } from "../post/post.component";
import { ListCommentComponent } from "../list-comment/list-comment.component";
import { FormCommentComponent } from "../form-comment/form-comment.component";
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { PostComment } from '../entities/comment.entity';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [PostComponent, ListCommentComponent, FormCommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);

  post: Post | null = null

  constructor(private postService: PostService){}

  async ngOnInit() {
    this.route.params.subscribe(params => {
       var id = +params['id'];
       this.postService.getPost(id).subscribe(post => this.post = post)
    }); 
  }

  addNewComment(comment: PostComment) {
    this.post?.comments.push(comment)
  }
}
