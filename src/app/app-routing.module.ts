import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';
import { GetIssueComponent } from './pages/authentication/get-issue/get-issue.component';
import { AppSideRegisterComponent } from './pages/authentication/side-register/side-register.component';
import { authGuard } from './guard/auth.guard';
import { PlansComponent } from './pages/authentication/plans/plans.component';

const routes: Routes = [
  {
    path: '',
    component: AppSideLoginComponent,
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'authentication/get-issue',
    component: GetIssueComponent,
  },
  {
    path: 'sign-up/:planId',
    component: AppSideRegisterComponent,
  },
  {
    path: 'plans',
    component: PlansComponent,
  },
  {
    path: 'starter',
    component: FullComponent,
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [authGuard],
  },
  {
    path: 'app',
    component: FullComponent,
    loadChildren: () =>
      import('./pages/app/apps.module').then((m) => m.AppsModule),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
