import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TimeSheetRoutingModule } from './time-sheet-routing.module';
import { TimeSheetComponent } from './time-sheet.component';
import { RecordActionComponent } from './record-action/record-action.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  TimePickerModule,
  DatePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { BoldLineDirective } from 'src/app/_directive/boldLine.directive';
import { FilterByMonthComponent } from './filter-by-month/filter-by-month.component';
import { CalculateWageComponent } from './calculate-wage/calculate-wage.component';
import { TimeSheetStatisticsComponent } from './time-sheet-statistics/time-sheet-statistics.component';

@NgModule({
  declarations: [
    TimeSheetComponent,
    RecordActionComponent,
    BoldLineDirective,
    FilterByMonthComponent,
    CalculateWageComponent,
    TimeSheetStatisticsComponent,
  ],
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
    SharedModule,
    TimePickerModule,
    DatePickerModule,
    SelectAutocompleteModule,
  ],
  providers: [DatePipe],
  entryComponents: [RecordActionComponent],
})
export class TimeSheetModule {}
