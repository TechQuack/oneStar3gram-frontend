import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaFile } from '../entities/media-file.entity';

@Injectable({
    providedIn: 'root'
})
export abstract class MediaFileService {
    private apiUrl = this.getApiUrl()

    constructor(private http: HttpClient) { }

    getMedia(id: number): Observable<MediaFile> {
        return this.http.get<MediaFile>(`${this.apiUrl}/${id}`);
    }

    getMedias(): Observable<MediaFile[]> {
        return this.http.get<MediaFile[]>(`${this.apiUrl}`);
    }

    createMedia(file: File): Observable<MediaFile> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<MediaFile>(`${this.apiUrl}/upload`, formData)
    }

    deleteMedia(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }

    downloadMedia(id: number): Observable<Blob> {
        return this.http.get<Blob>(`${this.apiUrl}/download/${id}`);
    }

    protected abstract getApiUrl() : string
}
