import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = environment.apiUrl + 'post'

    constructor(private http: HttpClient) { }

    getPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrl}/${id}`);
    }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}`);
    }

    getSelfPosts(): Observable<Post[]> {
      return this.http.get<Post[]>(`${this.apiUrl}/self`);
    }

    editPost(postId: number, alt: string | null, description: string | null, visibility: boolean | null): Observable<Post> {
      const body = {
        alt: alt,
        description: description,
        visibility: visibility
      }
      return this.http.put<Post>(`${this.apiUrl}/${postId}`, body);
    }

    sendPost(mediaId: number, alt: string, description: string, visibility: boolean): Observable<number> {
        const body = {
          mediaId: mediaId,
          alt: alt,
          description: description,
          visibility: visibility
        }
        return this.http.post<number>(`${this.apiUrl}`, body);
    }

    deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${postId}`);
    }

    likePost(postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/like/add/${postId}`, {})
    }

    unlikePost(postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/like/remove/${postId}`, {})
    }
}
