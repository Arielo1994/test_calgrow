import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
    data: {
      permission: 'read',
      resource: 'home'
    }
  },
  {
    title: 'Herramientas',
    group: true,
  },
  {
    title: 'Administrar Campos',
    icon: 'edit-2-outline',
    data: {
      permission: 'read',
      resource: 'fields-admin'
    },
    children: [
      {
        title: 'Configurar campos',
        link: '/pages/fields-admin/fields',
      },
      {
        title: 'Configurar sectores',
        link: '/pages/fields-admin/sectors',
      },
      {
        title: 'Configurar especies',
        link: '/pages/fields-admin/species',
      },
      {
        title: 'Configurar plantas',
        link: '/pages/fields-admin/plants',
      },
      {
        title: 'Configurar frutos',
        link: '/pages/fields-admin/fruits',
      },
    ],
  },
  {
    title: 'Informes',
    icon: 'pie-chart-outline',
    link: '/pages/charts/comparative',
    data: {
      permission: 'read',
      resource: 'charts'
    },
  },
  {
    title: 'Configurar sistema',
    icon: 'browser-outline',
    link: '',
    data: {
      permission: 'read',
      resource: 'charts'
    },
  },
  {
    title: 'Mi Suscripción',
    icon: 'grid-outline',
    link: '',
    data: {
      permission: 'read',
      resource: 'charts'
    },
  }
];
