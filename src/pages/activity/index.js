module.exports = [
  {
    path: '/activities',
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
];
