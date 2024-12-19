import { Component } from '@angular/core';
import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  posts : Post[] = []
  
  constructor(private postService: PostService) {}
  
  
    async ngOnInit() {
      this.postService.getPosts().subscribe(posts => this.posts = posts)
    }
  
}
