import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MediaFileService} from '../services/media-file.service';
import {PostService} from '../services/post.service';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';

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

  constructor(private mediaService: MediaFileService,
              private postService: PostService,
              private router: Router,
              private keycloakService: KeycloakService) {}

  ngOnInit() {
    const isAdmin: boolean = this.keycloakService.getUserRoles().includes('Admin');
    if (!isAdmin) {
      this.router.navigate([""]);
    }
  }

  onPickedMedia(event: Event) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    if (element.files != null) {
      const file = element.files[0];
      this.postForm.patchValue({media: file});
    }
  }

  onSubmit() {
    if (this.postForm.invalid) {
      return;
    }
    const alt: string = this.postForm.controls['alt'].value;
    const description: string = this.postForm.controls['description'].value;
    const isPrivate: boolean = this.postForm.controls['isPrivate'].value;
    const media: File = this.postForm.controls['media'].value;
    if (this.postForm.controls['isVideo'].value) {
      this.mediaService.uploadVideo(media).subscribe(mediaFile => {
        this.postService.sendPost(mediaFile.id, alt, description, isPrivate).subscribe(() => {
          this.router.navigate([""]);
        });
      });
    } else {
      this.mediaService.uploadImage(media).subscribe(mediaFile => {
        this.postService.sendPost(mediaFile.id, alt, description, isPrivate).subscribe(() => {
          this.router.navigate([""]);
        });
      });
    }
  }
}
