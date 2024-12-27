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
import { FileSizeService } from '../services/file-size.service';
import { environment } from '../../environments/environment';
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
  videosSize: number[] = []
  imagesSize: number[] = []
  videosExtension: string[] = []
  imagesExtension: string[] = []

  public mediaChart: Chart<"pie", number[], string> | null = null;

  public postChart: Chart<"pie", number[], string> | null = null;

  public videoChart: Chart<"pie", number[], string> | null = null;

  public imageChart: Chart<"pie", number[], string> | null = null;

  public userChart: Chart<"pie", number[], string> | null = null;

  constructor(private postService: PostService, private videoService: VideoService,
              private imageService: ImageService, private userService: UserService,
              private fileSizeService: FileSizeService
            ) {}

  async ngOnInit() {
    this.createCharts()
    this.getPosts()
    this.getMedias()
    this.getUsers()
  }

  getPosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts
      var numberOfPrivatePosts = posts.filter(post => post.isPrivate).length
      this.postChart!.data.datasets[0].data[0] = posts.length - numberOfPrivatePosts
      this.postChart!.data.datasets[0].data[1] = numberOfPrivatePosts
      this.postChart?.update()
    })
  }

  getMedias() {
    this.videoService.getMedias().subscribe(videos => {
      this.videos = videos
      videos.forEach(media => {
        this.manageVideoData(media)
        this.getVideoFileExtension(media.originName)
      })
      this.videoChart!.data.labels = [...new Set(this.videosExtension)]
      this.videoChart!.data.datasets[0].data = this.countElements(this.videosExtension)
      this.videoChart!.data.datasets[0].backgroundColor = this.getRandomColor(videos.length)
      this.mediaChart!.data.datasets[0].data[1] = videos.length
      this.mediaChart?.update()
      this.videoChart?.update()
    })
    this.imageService.getMedias().subscribe(images => {
      this.images = images
      images.forEach(media => {
        this.manageImageData(media)
        this.getImageFileExtension(media.originName)
      })
      this.imageChart!.data.labels = [...new Set(this.imagesExtension)]
      this.imageChart!.data.datasets[0].data = this.countElements(this.imagesExtension)
      this.imageChart!.data.datasets[0].backgroundColor = this.getRandomColor(images.length)
      this.mediaChart!.data.datasets[0].data[0] = images.length
      this.mediaChart?.update()
      this.imageChart?.update()
    })
  }

  getUsers() {
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
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
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
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
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
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
      }
    });

    this.imageChart = new Chart("ImageStat", {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          hoverOffset: 4
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
      }
    });

    this.videoChart = new Chart("VideoStat", {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          hoverOffset: 4
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
      }
    });
  }

  manageVideoData(media: MediaFile) {
    this.fileSizeService.fetchFileSize(environment.apiUrl + "uploads/" + media.generatedName).subscribe(
      number => this.videosSize.push(number)
    )
  }

  manageImageData(media: MediaFile) {
    this.fileSizeService.fetchFileSize(environment.apiUrl + "uploads/" + media.generatedName).subscribe(
      number => this.imagesSize.push(number)
    )
  }

  getVideoFileExtension(filename: string) {
    this.videosExtension.push(filename.split('.').pop() ?? "")
  }

  getImageFileExtension(filename: string) {
    this.imagesExtension.push(filename.split('.').pop() ?? "")
  }

  countElements(array: string[]) : number[] {
    const counts : Record<string, number> = {};
    array.forEach((el) => {
      counts[el] = counts[el] ? (counts[el] + 1) : 1;
    });
    return Object.values(counts)
  }

  getRandomColor(count: number): string[] {
    var arr = [];
    var colors: string[] = []
    for (var i = 0; i < count; i++) {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var x = 0; x < 6; x++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  } 

  getImageMeanSize(): number {
    if (this.imagesSize.length == 0) {
      return 0
    }
    if (this.imagesSize.length == 1) {
      return Math.round(this.imagesSize[0] / 1000)
    }
    return Math.round(this.sumArray(this.imagesSize) / this.imagesSize.length)
  }

  getVideoMeanSize(): number {
    if (this.videosSize.length == 0) {
      return 0
    }
    if (this.videosSize.length == 1) {
      return Math.round(this.videosSize[0] / 1000)
    }
    return Math.round(this.sumArray(this.videosSize) / this.videosSize.length)
  }

  sumArray(array: number[]) : number {
    if (array.length == 0) {
      return 0
    }
    return Math.round(array.reduce(function(a, b) {
      return a + b
    }) / 1000)
  }

}
