import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsInterface } from '../model/posts';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts'
  constructor() { }

  public getPosts(): Observable<PostsInterface[]> {
    return this.http.get<PostsInterface[]>(this.apiUrl)
  }
}
