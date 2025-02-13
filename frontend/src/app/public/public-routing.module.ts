import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { guardGuard } from '../core/gaurds/guard.guard';
import { ListComponent } from './features/task-lists/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        //canActivate: [guardGuard],
        loadChildren: () =>
          import('./features/task-lists/task-lists.module').then(
            (m) => m.TaskListsModule
          ),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
