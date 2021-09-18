import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {
      title: 'פרוייקטים',
      urls: [{ title: 'לוח הבקרה', url: '/dashboard' }, { title: 'פרויקטים' } ],
    },
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    // data: {
    //   // title: this.project,
    //   urls: [{ title: 'לוח הבקרה', url: '/dashboard' }, { title: 'פרויקטים' }],
    // },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
