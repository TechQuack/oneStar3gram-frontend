import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        let params = new HttpParams();
        //params = params.append("alt", alt)
        //params = params.append("description", description)
        //params = params.append("visibility", visibility)
        return this.http.put<Post>(`${this.apiUrl}/edit/${postId}`, { params : params}) //TODO
    }

    sendPost(postId: number, alt: string, description: string, visibility: boolean, mediaFileId: number): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/send`, {}) //TODO
    }

    deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${postId}`)
    }

    likePost(postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/like/add/${postId}`, {})
    }

    unlikePost(postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/like/remove/${postId}`, {})
    }
}
