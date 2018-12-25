import mockjs from 'mockjs';

export default {
  'GET /api/products': mockjs.mock({
    'list|10': [
      {
        id: '@id()',
        name: '@csentence(8,32)',
        'price|5-999': 100,
        mainImage: "@image('64x64', '#00405d', '#000', 'img')",
        'status|1-2': 1,
        'category|1': ['c0', 'c1', 'c2', 'c4', 'c5'],
      },
    ],
    page: 0,
    pagesize: 10,
    total: 20,
  }),
  'GET /api/product': mockjs.mock({
    id: '@id()',
    title: '@csentence(8,32)',
    'price|5-999': 100,
    'status|1-2': 1,
    'category|1': ['c0', 'c1', 'c2', 'c4', 'c5'],
    video: {
      url: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
      poster: 'http://www.w3school.com.cn/i/eg_mouse.jpg',
    },
    'images|3': [
      {
        type: 'image',
        url: "@image('128x128', '#00405d', '#000', 'mainImg')",
        name: '图1',
      },
    ],
    attributes: ['含票', '送货上门', '加印logo', '破损包赔', '定制杯盖', '任何奇葩需求'],
    'categories|5': [
      {
        id: '@id()',
        label: '@cword(6,10)',
        content: '@cparagraph(3, 8)',
      },
    ],
    content: [
      {
        type: 'text',
        align: 'center',
        size: 30,
        padding: 10,
        value: '@cparagraph(2, 4)',
      },
      {
        type: 'image',
        value: "@image('128x128', '#00405d', '#000', 'contImg')",
        height: 300,
      },
      {
        type: 'list',
        'value|5': [
          {
            label: '@cword(2,8)',
            content: '@csentence(16, 32)',
          },
        ],
      },
      {
        type: 'image',
        value: "@image('128x64', '#00405d', '#000', 'contImg')",
        height: 300,
      },
    ],
  }),
};
