import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';

const routes: Routes = [{
  path:'',
  component:EmployeesComponent,
  data:{
    title: 'עובדים',
    urls: [{ title: 'לוח הבקרה', url: '/dashboard' }, { title: 'עובדים' } ],
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
