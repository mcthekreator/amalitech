import { Component, inject } from '@angular/core';
import { ProfileService } from '../../shared/service/profile.service';
import { ProfileInterface } from '../../shared/model/profile-interface';
import { PostsService } from '../../shared/service/posts.service';
import { PostsInterface } from '../../shared/model/posts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private profileService = inject(ProfileService)
  private postService = inject(PostsService)
  public users: ProfileInterface[] = []
  public posts: PostsInterface[] = []
  public viewMode: string = 'posts';
  public condition: boolean = true;

  constructor() {
    this.getProfile()
    this.getPosts()
  }
  private getProfile() {
    this.profileService.getProfiles().subscribe((profile: ProfileInterface[]) => {
      this.users = profile

    })
  }

  private getPosts() {
    this.postService.getPosts().subscribe((post: PostsInterface[]) => {
      this.posts = post

    })
  }
}
