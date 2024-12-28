import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './config/role.config';
import { PostDetailComponent } from './post-detail/post-detail.component';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}},
  {path: 'post/:id', component: PostDetailComponent}
];
