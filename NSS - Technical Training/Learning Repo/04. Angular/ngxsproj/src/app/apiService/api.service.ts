import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AnimalGet } from '../model/AnimalGet.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient)

  private configUrl = 'https://jsonplaceholder.typicode.com/posts'

  constructor() { }

  getPosts() {
    return this.http.get<AnimalGet>(this.configUrl);
  }
}
