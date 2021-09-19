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


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsActionsComponent,
    ImageViewComponent,
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    FlexLayoutModule,
    SharedModule,
  ],
  providers:[
    DatePipe,
    ProjectsService
  ],
  entryComponents:[
    ProjectsActionsComponent,
    ImageViewComponent
  ]
})
export class ProjectsModule { }
