import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubdomainLoginComponent } from '../subdomain-login/subdomain-login.component';
import { ListComponent } from './list.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
