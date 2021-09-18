import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const AppRoutes: Routes = [

    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'projects',
                loadChildren: () => import('./components/projects/projects.module').then(m => m.ProjectsModule),
                canActivate: [AuthGuard],
            },
            {
                path:'employees',
                loadChildren:()=> import('./components/employees/employees.module').then(m=> m.EmployeesModule)
            }
            ,
            {
                path:'timesheet',
                loadChildren:()=> import('./components/timesheet/time-sheet.module').then(m=> m.TimeSheetModule)
            }

        ]
    },
    {
        path: 'login',
        loadChildren:()=>import('./login/auth.module').then((m)=>m.AuthModule)
    }
];
