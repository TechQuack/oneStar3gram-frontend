import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../entities/post.entity';
import { VideoService } from '../services/video.service';
import { ImageService } from '../services/image.service';
import { MediaFile } from '../entities/media-file.entity';
import {Chart} from 'chart.js/auto';
import {User} from '../entities/user.entity';
import {UserService} from '../services/user.service';
import {UserListComponent} from '../user-list/user-list.component';
import {forkJoin, map} from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UserListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  posts: Post[] = []
  images: MediaFile[] = []
  videos: MediaFile[] = []
  users: User[] = []

  public mediaChart: Chart<"pie", number[], string> | null = null;

  public postChart: Chart<"pie", number[], string> | null = null;

  public userChart: Chart<"pie", number[], string> | null = null;

  constructor(private postService: PostService, private videoService: VideoService,
              private imageService: ImageService, private userService: UserService) {}

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

    this.userService.getUsers().subscribe(users => {
      this.users = users;

      const roleObservables = users.map(user => {
        return forkJoin([
          this.userService.hasRole(user.id, 'Admin'),
          this.userService.hasRole(user.id, 'Privileged')
        ]).pipe(
          map(([isAdmin, isPrivileged]) => ({ user, isAdmin, isPrivileged }))
        );
      });

      forkJoin(roleObservables).subscribe(results => {
        const adminCount = results.filter(result => result.isAdmin).length;
        const privilegedCount = results.filter(result => result.isPrivileged).length;
        const normalCount = users.length - adminCount - privilegedCount;

        this.userChart!.data.datasets[0].data[0] = adminCount;
        this.userChart!.data.datasets[0].data[1] = privilegedCount;
        this.userChart!.data.datasets[0].data[2] = normalCount;

        this.userChart?.update();
      });
    });
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

    this.userChart = new Chart("UserStat", {
      type: 'pie',
      data: {
        labels: ['Admin', 'Privileged', 'User'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            'red',
            'blue',
            'yellow'
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
