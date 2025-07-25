
const routes = [
  ///Home
  // {
  //   path: '/',
  //   name:'home',
  //   component: () => import('pages/IndexPage.vue'),
  //   meta:{
  //     title:'Home',
  //     roles:[]
  //   },
  //   icon:'home',
  //   visible:false,
  // },

  ///Dashboard
  {
    path: '/',
    name:'dashboard',
    component: () => import('src/pages/dashBoard.vue'),
    meta:{
      title:'Dashboard',
      roles:[]
    },
    icon:'dashboard',
    visible:true,
  },
  ///USER
  {
    path: '/Users',
    name:'users',
    component: () => import('pages/userMgt.vue'),
    meta:{
      title:'Users',
      roles:['ADMIN']
    },
    icon:'groups',
    visible:true,
  },
  ///Queues
  {
    path: '/Queues',
    name:'queues',
    component: () => import('pages/queueCtrl.vue'),
    meta:{
      title:'Queues',
      roles:['ADMIN']
    },
    icon:'receipt_long',
    visible:true,
  },
  ////Logs
  {
    path: '/Logs',
    name:'logs',
    component: () => import('src/pages/queueLogs.vue'),
    meta:{
      title:'QLogs',
      roles:['ADMIN']
    },
    icon:'library_books',
    visible:true
  },

  ///Services
  {
    path: '/Services',
    name:'services',
    component: () => import('pages/servicesMgt.vue'),
    meta:{
      title:'Services',
      roles:['ADMIN']
    },
    icon:'miscellaneous_services',
    visible:true,
  },  
 
  ///Settings
  {
    path: '/Settings',
    name:'settings',
    component: () => import('pages/configSetting.vue'),
    meta:{
      title:'Settings',
      roles:['ADMIN']
    },
    icon:'settings',
    visible:true,
  },
  // log in
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/LoginPage.vue'),
    meta: {
      title: 'Login'
    },
    icon: 'login',
    visible: true,
  },
  //window card
    {
      path: '/WindowCard',
      name:'windowCard',
      component: () => import('pages/windowCard.vue'),
      meta:{
        title:'Window Card',
        roles:['ADMIN']
      },
      icon:'cast',
      visible:true,
    },
    //cashier dashboard
    {
      path: '/cashierDashboard',
      name:'cashierDashboard',
      component: () => import('pages/cashierDashboard.vue'),
      meta:{
        title:'Cashier Dashboard',
        roles:['CASHIER']
      },
      icon:'point_of_sale',
      visible:true,
    },
    //Kiosk
    {
      path: '/Kiosk',
      name:'kioskPage',
      component: () => import('pages/kioskPage.vue'),
      meta:{
        title:'Kiosk',
        roles:['KIOSK']
      },
      icon:'token',
      visible:true,
    },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name:'catchAll',
    component: () => import('pages/ErrorNotFound.vue'),
    meta:{
      title:'Not Found',
    },
    icon:'error',
    visible:false,
  },
  {
    path: '/accessDenied',
    name:'accessDenied',
    component: () => import('pages/accessDenied.vue'),
    meta:{
      title:'Denied',
    },
    icon:'error',
    visible:false,
  }, 
  
  ///Sign In
  {
    path: '/signIn',
    name:'signIn',
    component: () => import('pages/LandingPage.vue'),
    meta:{
      title:'Sign In',
    },
    visible:false,
  }
]

export default routes

/**
 * for icons sets
 *  https://material.io/icons/
 */
