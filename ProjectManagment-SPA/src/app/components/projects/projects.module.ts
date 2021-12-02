import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsActionsComponent } from './projects-actions/projects-actions.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsService } from 'src/app/_services/projects.service';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { EmployeeWorkedDaysComponent } from './project/employee-worked-days/employee-worked-days.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PaidsDetailsComponent } from './project/paids-details/paids-details.component';
import { AddPaidsComponent } from './project/paids-details/add-paids/add-paids.component';
import { DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { QuotationActionComponent } from './project/project-details/quotation-action/quotation-action.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsActionsComponent,
    ImageViewComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    EmployeeWorkedDaysComponent,
    PaidsDetailsComponent,
    AddPaidsComponent,
    QuotationActionComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    TimePickerModule,
    DatePickerModule,
  ],
  providers:[
    DatePipe,
    ProjectsService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  entryComponents:[
    ProjectsActionsComponent,
    ImageViewComponent,
    AddPaidsComponent,
    QuotationActionComponent
  ]
})
export class ProjectsModule { }
