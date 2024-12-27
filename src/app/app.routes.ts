import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AddContentComponent} from './add-content/add-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './config/role.config';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'add', component: AddContentComponent},
  {path: 'edit/:id', component: AddContentComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}}
];
