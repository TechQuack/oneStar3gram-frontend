import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AddContentComponent} from './add-content/add-content.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'add', component: AddContentComponent},
];
