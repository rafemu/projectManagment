import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsActionsComponent } from './projects-actions/projects-actions.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsService } from 'src/app/_services/projects.service';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { EmployeeWorkedDaysComponent } from './project/employee-worked-days/employee-worked-days.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PaidsDetailsComponent } from './project/paids-details/paids-details.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsActionsComponent,
    ImageViewComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    EmployeeWorkedDaysComponent,
    PaidsDetailsComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
  ],
  providers:[
    DatePipe,
    ProjectsService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  entryComponents:[
    ProjectsActionsComponent,
    ImageViewComponent
  ]
})
export class ProjectsModule { }
