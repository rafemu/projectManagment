import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  TimePickerModule,
  DatePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { SalaryRoutingModule } from './salary-routing.module';
import { SalaryComponent } from './salary.component';
import { CalcHrComponent } from './calc-hr/calc-hr.component';
import { AllSalariesComponent } from './all-salaries/all-salaries.component';
import { LastSalariesComponent } from './last-salaries/last-salaries.component';
import { GetlastSalariesComponent } from './getlast-salaries/getlast-salaries.component';


@NgModule({
  declarations: [
    SalaryComponent,
    CalcHrComponent,
    AllSalariesComponent,
    LastSalariesComponent,
    GetlastSalariesComponent
  ],
  imports: [
    CommonModule,
    SalaryRoutingModule,
    SharedModule,
    TimePickerModule,
    DatePickerModule,
  ]
})
export class SalaryModule { }
