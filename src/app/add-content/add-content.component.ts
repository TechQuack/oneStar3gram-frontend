import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MediaFileService} from '../services/media-file.service';
import {PostService} from '../services/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {ImageService} from "../services/image.service";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'app-add-content',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.scss'
})
export class AddContentComponent {
  postForm: FormGroup = new FormGroup({
    isVideo: new FormControl(false),
    media: new FormControl(null, Validators.required),
    alt: new FormControl('', Validators.maxLength(200)),
    description: new FormControl('', Validators.maxLength(500)),
    isPrivate: new FormControl(false, Validators.required)
  });

  id: number = 0;

  constructor(private imageService: ImageService,
              private videoService: VideoService,
              private postService: PostService,
              private router: Router,
              private keycloakService: KeycloakService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    const isAdmin: boolean = this.keycloakService.getUserRoles().includes('Admin');
    if (!isAdmin) {
      this.router.navigate([""]);
    }
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.id = +params['id'];
        this.postService.getPost(this.id).subscribe(post => {
          this.postForm.controls['isVideo'].setValue(post.media.video);
          this.postForm.controls['alt'].setValue(post.alt);
          this.postForm.controls['description'].setValue(post.alt);
        })
      }
    })
  }

  isAddingNewPost() {
    return this.id == 0;
  }

  onPickedMedia(event: Event) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    if (element.files != null) {
      const file = element.files[0];
      this.postForm.patchValue({media: file});
    }
  }

  onSubmit() {
    if (this.postForm.invalid && this.isAddingNewPost()) {
      return;
    }
    const alt: string = this.postForm.controls['alt'].value;
    const description: string = this.postForm.controls['description'].value;
    const isPrivate: boolean = this.postForm.controls['isPrivate'].value;
    const media: File = this.postForm.controls['media'].value;
    if (this.isAddingNewPost()) {
      if (this.postForm.controls['isVideo'].value) {
        this.videoService.createMedia(media).subscribe(mediaFile => {
          this.postService.sendPost(mediaFile.id, alt, description, isPrivate).subscribe(() => {
            this.router.navigate([""]);
          });
        });
      } else {
        this.imageService.createMedia(media).subscribe(mediaFile => {
          this.postService.sendPost(mediaFile.id, alt, description, isPrivate).subscribe(() => {
            this.router.navigate([""]);
          });
        });
      }
    } else {
      this.postService.editPost(this.id, alt, description, isPrivate).subscribe(() => {
        this.router.navigate([""]);
      });
    }
  }
}
