import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MediaFile} from '../entities/media-file.entity';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MediaFileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<MediaFile> {
    return this.http.post<MediaFile>(`${this.apiUrl}image/upload`, file);
  }

  uploadVideo(file: File): Observable<MediaFile> {
    return this.http.post<MediaFile>(`${this.apiUrl}video/upload`, file);
  }
}
