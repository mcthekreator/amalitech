import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileInterface } from '../model/profile-interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient)
  constructor() { }
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  public getProfiles(): Observable<ProfileInterface[]> {
    return this.http.get<ProfileInterface[]>(this.apiUrl);
  }
}
