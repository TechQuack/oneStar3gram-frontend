import { Injectable } from '@angular/core';
import { Post } from '../entities/post.entity';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PostComment } from '../entities/comment.entity';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = environment.apiUrl + 'post'

    constructor(private http: HttpClient, private keycloakService: KeycloakService) { }

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

  getUserPosts(username: string): Observable<Post[]> {
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Post[]>(`${this.apiUrl}/author/${username}`, {headers}).pipe(
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

    editPost(postId: number, alt: string | null, description: string | null, private_: boolean | null): Observable<Post> {
      const body = {
        alt: alt,
        description: description,
        private: private_
      }
      return this.http.put<Post>(`${this.apiUrl}/${postId}`, body).pipe(
        map(response => {
          response.comments = this.manageComments(response.comments)
          return response
        })
      );
    }

    sendPost(mediaId: number, alt: string, description: string, private_: boolean): Observable<number> {
        const body = {
          mediaId: mediaId,
          alt: alt,
          description: description,
          private: private_
        }
        return this.http.post<number>(`${this.apiUrl}`, body);
    }

    deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${postId}`);
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
