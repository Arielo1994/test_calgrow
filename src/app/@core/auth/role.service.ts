import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbRoleProvider } from '@nebular/security';

@Injectable()
export class RoleProvider implements NbRoleProvider {

  constructor(private authService: NbAuthService) {
  }

  getRole(): Observable<string> {
    return this.authService.getToken()
      .pipe(
        map((token: NbAuthJWTToken) => {
          console.log(token.getPayload()['role'])
          return token.isValid() ? token.getPayload()['role'] : 'guest';
        }),
      );
  }
}