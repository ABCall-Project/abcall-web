import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { GetIssueComponent } from './get-issue/get-issue.component';
import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: AppErrorComponent,
      },

      {
        path: 'side-login',
        component: AppSideLoginComponent,
      },
      {
        path: 'side-register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'get-issue',
        component: GetIssueComponent,
      },
    ],
  },
];
