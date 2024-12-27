import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MediaFile} from '../entities/media-file.entity';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MediaFileService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaFile>(`${this.apiUrl}image/upload`, formData);
  }

  uploadVideo(file: File): Observable<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaFile>(`${this.apiUrl}video/upload`, formData);
  }
}
