import { Component, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() id: number = 0;

  post: Post | null = null;

  constructor(private postService: PostService) {}


  async ngOnInit() {
    this.postService.getPost(this.id).subscribe(post => this.post = post)
  }

}
