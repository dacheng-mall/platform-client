module.exports = [
  {
    path: '/activities/list',
    component: 'activity/list',
  },
  {
    path: '/activities/type',
    component: 'activity/type',
  },
  {
    path: '/instActivity',
    component: 'activity/list',
  },
  {
    path: '/activity/:id',
    component: 'activity/detail',
  },
  {
    path: '/activity',
    component: 'activity/detail',
  },
  {
    path: '/activity/user/:id',
    component: 'activity/contestants',
  },
  {
    path: '/activity/user/:id',
    component: 'activity/contestants',
  },
  {
    path: '/activity/:id/team',
    component: 'activity/team',
  },
  {
    path: '/activity/:id/gift',
    component: 'activity/gift',
  },
];
