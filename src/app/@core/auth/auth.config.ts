import { NbAuthJWTToken, NbPasswordAuthStrategyOptions } from '@nebular/auth';

//const env: string = isDevMode() ? 'development' : 'production';

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const formSetting: any = {
  redirectDelay: 100,
  showMessages: {
    success: true,
    error: true
  },
  //socialLinks,
};

export const strategyOptions: NbPasswordAuthStrategyOptions = {
  name: 'email',
  //baseEndpoint: 'https://dashboard.calgrow.cl/api/auth/',
  baseEndpoint: 'https://dashboard.calgrow.cl/auth/',
  token: {
    class: NbAuthJWTToken,
    key: 'token', // this parameter tells where to look for the token
  },
  login: {
    endpoint: 'sign-in',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: '/',
      failure: null,
    },
  },
  register: {
    endpoint: 'sign-up',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: null,
      failure: null,
    },
  },
  logout: {
    endpoint: 'sign-out',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: '/',
      failure: null,
    },
  },
  requestPass: {
    endpoint: 'request-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
  },
  resetPass: {
    endpoint: 'reset-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
  },
}

export const formConfig = {
  login: formSetting,
  register: formSetting,
  requestPassword: formSetting,
  resetPassword: formSetting,
  logout: {
    redirectDelay: 0,
  },
  validation: {
    password: {
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      required: true,
    },
    fullName: {
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    role: {
      required: true,
    }
  },
}

export const roleConfig = {
  accessControl: {
    guest: {
      read: 'home'
    },
    operator: {
      parent: 'guest',
      create: 'measurements',
      read: ['measurements', 'fields-admin'],
      update: 'measurements',
      delete: 'measurements'
    },
    admin: {
      parent: 'operator',
      create: ['fields-admin', 'operators', 'users'],
      read: ['fields-admin', 'operators', 'users', 'charts'],
      update: ['fields-admin', 'operators', 'users'],
      delete: ['fields-admin', 'operators', 'users'],
    },
    superadmin: {
      create: 'subscriptions',
      read: ['subscriptions', 'statistics'],
      update: 'subscriptions',
      delete: 'subscriptions'
    },
  },
};