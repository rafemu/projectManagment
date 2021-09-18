import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeActionsComponent } from './employee-actions/employee-actions.component';


@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeActionsComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    SharedModule
  ],
  entryComponents:[
    EmployeeActionsComponent
  ],
  providers:[
    DatePipe
  ]
})
export class EmployeesModule { }
