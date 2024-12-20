import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostComment } from '../entities/comment.entity';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrlComment = environment.apiUrl + 'comments'
    private apiUrlPost = environment.apiUrl + 'posts'

    constructor(private http: HttpClient) { }

    getComment(id: number): Observable<PostComment> {
      return this.http.get<PostComment>(`${this.apiUrlComment}/${id}`);
    }

    getPostComments(id: number): Observable<PostComment[]> {
      return this.http.get<PostComment[]>(`${this.apiUrlPost}/${id}/comments`);
    }

    getPostFromComment(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrlComment}/${id}/post`);
    }

    postComment(id : number, value : string): Observable<PostComment> {
      return this.http.post<PostComment>(`${this.apiUrlPost}/${id}/value/${value}`, {})
    }

    putComment(id : number, value : string): Observable<PostComment> {
      return this.http.put<PostComment>(`${this.apiUrlComment}/${id}/value/${value}`, {})
    }

    putLikeComment(id : number): Observable<PostComment> {
      return this.http.put<PostComment>(`${this.apiUrlComment}/${id}/like`, {})
    }

    // putUnlikeComment(id : number): Observable<PostComment> {
    //   return this.http.put<PostComment>(`${this.apiUrlComment}/${id}/unlike`, {})
    // }

    deleteComment(id : number): Observable<PostComment> {
      return this.http.delete<PostComment>(`${this.apiUrlComment}/${id}`, {})
    }

}
