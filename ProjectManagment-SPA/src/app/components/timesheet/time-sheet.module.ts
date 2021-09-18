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

@NgModule({
  declarations: [TimeSheetComponent, RecordActionComponent],
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
    SharedModule,
    TimePickerModule,
    DatePickerModule,
    SelectAutocompleteModule,
  ],
  providers: [DatePipe],
  entryComponents:[
    RecordActionComponent
  ]
})
export class TimeSheetModule {}
