import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MediaFileService} from '../services/media-file.service';
import {PostService} from '../services/post.service';
import {Router} from '@angular/router';

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
    video: new FormControl(null),
    image: new FormControl(null),
    alt: new FormControl('', Validators.maxLength(200)),
    description: new FormControl('', Validators.maxLength(500)),
    IsPrivate: new FormControl(true)
  });

  constructor(private mediaService: MediaFileService, private postService: PostService, private router: Router) {}

  onSubmit() {
    if (this.postForm.invalid) {
      //TODO: display error to user
      return;
    }
    let mediaId: number = 0;
    const alt: string = this.postForm.controls['alt'].value;
    const description: string = this.postForm.controls['description'].value;
    const IsPrivate: boolean = this.postForm.controls['IsPrivate'].value;
    if (this.postForm.controls['isVideo'].value) {
      const file: File = this.postForm.controls['video'].value;
      this.mediaService.uploadVideo(file).subscribe(mediaFile => mediaId = mediaFile.id);
    } else {
      const file: File = this.postForm.controls['image'].value;
      this.mediaService.uploadImage(file).subscribe(mediaFile => mediaId = mediaFile.id);
    }
    this.postService.sendPost(mediaId, alt, description, IsPrivate);
    this.router.navigate(['/']);
  }
}
