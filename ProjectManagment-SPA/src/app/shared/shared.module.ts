import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective,
} from './accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../_services/token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../_services/token-interceptor';
import { DemoMaterialModule } from '../demo-material-module';
import { HorizontalMenuItems } from './menu-items/horizontal-menu-items';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentPipe } from '../_pipes/moment.pipe';
import { ProjectsPipe } from '../_pipes/projects.pipe';
// import { MatTableResponsiveDirective } from '../_directive/table/mat-table-responsive.directive';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    // MatTableResponsiveDirective,
    MomentPipe,
    ProjectsPipe,
  ],
  imports: [
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  exports: [
    DemoMaterialModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MomentPipe,
    ProjectsPipe,
    // MatTableResponsiveDirective
  ],
  providers: [
    TokenService,
    MenuItems,
    HorizontalMenuItems,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
})
export class SharedModule {}
