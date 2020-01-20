import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  /*login(): void {
    this.service.getToken().subscribe(data => {
      console.log(data.getPayload())
      super.login();
    });
  }*/
}
