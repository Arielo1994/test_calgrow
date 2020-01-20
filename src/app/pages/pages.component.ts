import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbAccessChecker } from '@nebular/security';
import { NbMenuService, NbMenuItem, NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../@core/utils';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  public menu: NbMenuItem[] = MENU_ITEMS;

  constructor(
    public accessChecker: NbAccessChecker,
    public menuService: NbMenuService,

    private sidebarService: NbSidebarService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.authMenuItems();
  }
  
  authMenuItems() {
    this.menu.forEach(item => {
      this.authMenuItem(item);
    });
  }

  authMenuItem(menuItem: NbMenuItem) {
    if (menuItem.data && menuItem.data['permission'] && menuItem.data['resource']) {
      this.accessChecker.isGranted(menuItem.data['permission'], menuItem.data['resource']).subscribe(granted => {
        menuItem.hidden = !granted;
      });
    } else {
      menuItem.hidden = true;
    }
    if (!menuItem.hidden && menuItem.children != null) {
      menuItem.children.forEach(item => {
        if (item.data && item.data['permission'] && item.data['resource']) {
          this.accessChecker.isGranted(item.data['permission'], item.data['resource']).subscribe(granted => {
            item.hidden = !granted;
          });
        } else {
          // if child item do not config any `data.permission` and `data.resource` just inherit parent item's config
          item.hidden = menuItem.hidden;
        }
      });
    }
  }
}
