import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'post/:id', component: PostDetailComponent}
];
