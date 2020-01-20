
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NbAuthComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from '@nebular/auth';
import { NgxLoginComponent } from './login/login.component';
import { NgxAddUserComponent } from './add-user/add-user.component';
import { NgxLogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NgxLoginComponent,
      },
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      {
        path: 'adduser',
        component: NgxAddUserComponent,
      },
      {
        path: 'logout',
        component: NgxLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}