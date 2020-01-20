import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

import { LayoutService } from '../../../@core/utils';
import { Subject } from 'rxjs';

interface User { id: number, name: string, role: string, subscription: string, picture?: string }

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;

  userMenu = [
    { title: 'Mi Perfil', link: '' },
    { title: 'Cerrar sesión', link: '/auth/logout' },
  ];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private layoutService: LayoutService,
    private authService: NbAuthService) {
  }

  ngOnInit() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
