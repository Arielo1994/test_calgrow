import { NbAuthService, NbAuthResult } from '@nebular/auth';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Common authentication service.
 * Should be used to as an interlayer between UI Components and Auth Strategy.
 */
@Injectable()
export class NgxAuthService extends NbAuthService {
  /**
  * Registers with the selected strategy WITHOUT STORING THE RECIEVED TOKEN.
  *
  * Example:
  * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
  *
  * @param strategyName
  * @param data
  * @returns {Observable<NbAuthResult>}
  */
  public addUser(strategyName: string, data?: any): Observable<NbAuthResult> {
    return this.getStrategy(strategyName).register(data);
  }
}