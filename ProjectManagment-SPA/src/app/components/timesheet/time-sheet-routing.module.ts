import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeSheetComponent } from './time-sheet.component';

const routes: Routes = [{
  path:'',
  component:TimeSheetComponent,
  data:{
    title: 'דיווח משכורות',
    urls: [{ title: 'לוח הבקרה', url: '/dashboard' }, { title: 'דיווח משכורות' } ],
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetRoutingModule { }
