import mockjs from 'mockjs';

export default {
  'GET /api/admins': mockjs.mock({
    'list|10': [
      {
        name: '@cname',
        id: '@id()',
        roles: ['admin'],
        'mobile|11': '8',
        'gender|1': ['male', 'female', 'secret'],
        username: '@first()',
        'idcard|15': '9',
        'status|1-2': 1,
      },
    ],
    page: 0,
    pagesize: 10,
    total: 20,
  }),
};
