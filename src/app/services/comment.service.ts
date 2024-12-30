import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PostComment } from '../entities/comment.entity';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrlComment = environment.apiUrl + 'comment'
    private apiUrlPost = environment.apiUrl + 'post'

    constructor(private http: HttpClient) { }

    getComment(id: number): Observable<PostComment> {
      return this.http.get<PostComment>(`${this.apiUrlComment}/${id}`).pipe(
        map( response => this.manageComment(response),
        )
      );
    }

    getPostComments(id: number): Observable<PostComment[]> {
      return this.http.get<PostComment[]>(`${this.apiUrlPost}/${id}/comments`).pipe(
        map( responses => 
          responses.map(response => this.manageComment(response)),
        )
      );
    }

    getPostFromComment(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrlComment}/${id}/post`);
    }

    postComment(id : number, value : string): Observable<PostComment> {
      return this.http.post<PostComment>(`${this.apiUrlPost}/${id}/comments/value`, value).pipe(
        map( response => this.manageComment(response),
        )
      );
    }

    putComment(id : number, value : string): Observable<PostComment> {
      return this.http.put<PostComment>(`${this.apiUrlComment}/${id}/value/${value}`, {})
    }

    putLikeComment(id : number): Observable<PostComment> {
      return this.http.put<PostComment>(`${this.apiUrlComment}/${id}/like`, {}).pipe(
        map( response => this.manageComment(response),
        )
      );
    }

    deleteComment(id : number): Observable<PostComment> {
      return this.http.delete<PostComment>(`${this.apiUrlComment}/${id}`, {})
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
