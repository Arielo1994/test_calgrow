import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import {
  NbAlertModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbSelectModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';

import { AuthGuardService } from './auth-guard.service';
import { strategyOptions, formConfig } from './auth.config.js';
import { NgxLoginComponent } from './login/login.component';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NgxAddUserComponent } from './add-user/add-user.component';
import { NgxLogoutComponent } from './logout/logout.component';
import { NgxAuthService } from './auth.service';

@NgModule({
  declarations: [
    NgxLoginComponent,
    NgxAddUserComponent,
    NgxLogoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbIconModule,
    NbSelectModule,
    NgxAuthRoutingModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup(strategyOptions),
      ],
      forms: formConfig
    }),
  ],
  providers: [
    AuthGuardService,
    NgxAuthService,
  ],
})
export class NgxAuthModule { }
