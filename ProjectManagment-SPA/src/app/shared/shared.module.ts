import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../_services/token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../_services/token-interceptor';
import { DemoMaterialModule } from '../demo-material-module';
import { HorizontalMenuItems } from './menu-items/horizontal-menu-items';
import { EmployeesService } from '../_services/employees.service';
import { ProjectsService } from '../_services/projects.service';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  imports:[
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DemoMaterialModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    TokenService,MenuItems,HorizontalMenuItems,EmployeesService,ProjectsService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class SharedModule {}
