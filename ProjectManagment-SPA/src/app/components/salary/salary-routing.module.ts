import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryComponent } from './salary.component';

const routes: Routes = [
  {
    path: '',
    component: SalaryComponent,
    data: {
      title: 'משכורות',
      urls: [{ title: 'לוח הבקרה', url: '/dashboard' }, { title: 'משכורות' } ],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRoutingModule { }
