import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PostComment } from '../entities/comment.entity';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = environment.apiUrl + 'post'

    constructor(private http: HttpClient) { }

    getPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
            map(response => {
                response.comments = this.manageComments(response.comments)
                return response
            })
        );
    }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}`).pipe(
            map(response => 
                response.map(
                    response => {
                        response.comments = this.manageComments(response.comments)
                        return response
                    }
                )
            )
        );
    }

    getSelfPosts(): Observable<Post[]> {
      return this.http.get<Post[]>(`${this.apiUrl}/self`);
    }

    editPost(postId: number, alt: string | null, description: string | null, visibility: boolean | null): Observable<Post> {
        let params = new HttpParams();
        //params = params.append("alt", alt)
        //params = params.append("description", description)
        //params = params.append("visibility", visibility)  //TODO
        return this.http.put<Post>(`${this.apiUrl}/edit/${postId}`, { params : params}).pipe(
            map(response => {
                response.comments = this.manageComments(response.comments)
                return response
            })
        );
    }

    sendPost(postId: number, alt: string, description: string, visibility: boolean, mediaFileId: number): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/send`, {}) //TODO
    }

    deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${postId}`)
    }

    likePost(postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/like/${postId}`, {}).pipe(
            map(response => {
                response.comments = this.manageComments(response.comments)
                return response
            })
        );
    }

    private manageComments(comments: PostComment[]) : PostComment[] {
        return comments.map(comment => this.manageComment(comment))
    }

    private manageComment(comment : PostComment) : PostComment {
        return {
            id: comment.id,
            author: comment.author,
            value: comment.value,
            postDate: new Date(comment.postDate),
            likers: comment.likers
          }
    }
}
