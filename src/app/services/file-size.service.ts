import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileSizeService {

  constructor(private http: HttpClient) { }

  fetchFileSize(url: string): Observable<number> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => blob.size)
    );
  }
}