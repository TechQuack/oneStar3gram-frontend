import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { VideoService } from '../services/video.service';
import { ImageService } from '../services/image.service';
import { MediaFile } from '../entities/media-file.entity';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  posts: Post[] = []
  images: MediaFile[] = []
  videos: MediaFile[] = []

  public mediaChart: Chart | null = null;
  public postChart: Chart | null = null;

  constructor(private postService: PostService, private videoService: VideoService, private imageService: ImageService) {}

  async ngOnInit() {
    this.createCharts()
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts
      var numberOfPrivatePosts = posts.filter(post => post.private).length
      this.postChart!.data.datasets[0].data[0] = posts.length - numberOfPrivatePosts
      this.postChart!.data.datasets[0].data[1] = numberOfPrivatePosts
      this.postChart?.update()
    })
    this.videoService.getMedias().subscribe(videos => {
      this.videos = videos
      this.mediaChart!.data.datasets[0].data[1] = videos.length
      this.mediaChart?.update()
    })
    this.imageService.getMedias().subscribe(images => {
      this.images = images
      this.mediaChart!.data.datasets[0].data[0] = images.length
      this.mediaChart?.update()
    })
  }

  createCharts(){
    this.mediaChart = new Chart("MediaStat", {
      type: 'pie',
      data: {
        labels: ['Images','Videos'],
        datasets: [{
          data: [0, 0],
          backgroundColor: [
            'red',
            'blue',            
          ],
          hoverOffset: 4
        }],
      },
      options: {
        responsive: true
      }
    });

    this.postChart = new Chart("PostStat", {
      type: 'pie',
      data: {
        labels: ['Public','Private'],
        datasets: [{
          data: [0, 0],
          backgroundColor: [
            'red',
            'blue',            
          ],
          hoverOffset: 4
        }],
      },
      options: {
        responsive: true
      }
    });
  }



}
