import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeActionsComponent } from './employee-actions/employee-actions.component';
import { EmployeesService } from 'src/app/_services/employees.service';
import { DailyWageComponent } from './daily-wage/daily-wage.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';


@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeActionsComponent,
    DailyWageComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    SharedModule,
    DatePickerModule
  ],
  entryComponents:[
    EmployeeActionsComponent
  ],
  providers:[
    DatePipe,EmployeesService
  ]
})
export class EmployeesModule { }
