import { Routes } from '@angular/router';

import { StarterComponent } from './starter.component';

export const StarterRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
	data: {
      title: 'דף הבית',
      urls: [
        { title: 'לוח הבקרה', url: '/dashboard' },
        { title: 'דף הבית' }
      ]
    }
  }
];
