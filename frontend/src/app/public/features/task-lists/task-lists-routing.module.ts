import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListsComponent } from './task-lists.component';
import { ListComponent } from './list/list.component';
import { SubdomainLoginComponent } from './subdomain-login/subdomain-login.component';
import { guardGuard } from '../../../core/gaurds/guard.guard';

const routes: Routes = [
  {path:'',//canActivate: [guardGuard], 
   component: TaskListsComponent},
  {path: 'taskList/:id', component:  SubdomainLoginComponent},
  {path:'tasks/:id',component: ListComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskListsRoutingModule { }
