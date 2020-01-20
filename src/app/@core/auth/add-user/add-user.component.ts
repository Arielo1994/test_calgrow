import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { NbRegisterComponent, NbAuthResult, NB_AUTH_OPTIONS, NbAuthJWTToken } from '@nebular/auth';
import { Router } from '@angular/router';
import { NgxAuthService } from '../auth.service';

@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class NgxAddUserComponent extends NbRegisterComponent implements OnInit {

  constructor(protected service: NgxAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router) {
    super(service, options, cd, router)
  }

  ngOnInit() {
    this.service.getToken().subscribe({
      next: function (token: NbAuthJWTToken) {
        console.log(token.getPayload());
        this.user.subscriptionId = token.getPayload().subscriptionId;
      }.bind(this),
    })
  }

  addUser(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    console.log(this.user)
    this.service.addUser(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
      console.log(result)
    });

  }
}
