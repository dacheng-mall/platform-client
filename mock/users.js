import mockjs from 'mockjs';

export default {
  'GET /api/admins': mockjs.mock({
    'list|10': [
      {
        name: '@cname',
        id: '@id()',
        roles: ['admin'],
        'mobile|11': '8',
        username: '@first()',
        'status|+1': [1, 0],
      },
    ],
    page: 0,
    pagesize: 10,
    total: 20,
  }),
};
