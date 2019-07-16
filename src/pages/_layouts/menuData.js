import { getAuthority, checkAuthority } from '../../utils/authority';

const _checkAuthority = (limitRoles) => checkAuthority(limitRoles)(getAuthority());

// const all = _checkAuthority([1,4]);
/* 
roles编码
平台管理员:   1
普通客户:    2
机构管理员:   3
业务员:     4
*/
export const menu = () => {
  const admin = _checkAuthority([1]);
  const instAdmin = _checkAuthority([3]);
  const all = _checkAuthority([1,3]);
  return [
    {
      name: '人员管理',
      authority: instAdmin,
      icon: 'iconfont icon-user',
      path: 'instUser',
      children: [
        {
          name: '业务员管理',
          icon: 'iconfont icon-user',
          path: 'salesmans',
          authority: instAdmin,
        },
        {
          name: '机构管理员',
          icon: 'iconfont icon-user',
          path: 'instAdmin',
          authority: instAdmin,
        },
      ]
    },
    {
      name: '活动管理',
      authority: instAdmin,
      icon: 'iconfont icon-user',
      path: 'instActivity'
    },
    {
      name: '人员管理',
      authority: admin,
      path: 'users',
      children: [
        {
          name: '平台管理员',
          path: 'admin',
          authority: admin,
        },
        {
          name: '业务员',
          path: 'seller',
          authority: admin,
        },
        {
          name: '客户',
          path: 'customer',
          authority: admin,
        },
      ],
    },
    {
      name: '商品管理',
      authority: admin,
      path: 'products',
      children: [
        {
          name: '商品分类管理',
          path: 'categories',
          authority: admin,
        },
        {
          name: '自营商品',
          path: 'self',
          authority: admin,
        },
        {
          name: '第三方商品',
          path: 'third',
          authority: admin,
        },
      ],
    },
    {
      name: '内容管理',
      path: 'cms',
      authority: admin,
      children: [
        {
          name: '素材管理',
          path: 'elements',
          authority: admin,
        },
        {
          name: '页面管理',
          path: 'pages',
          authority: admin,
        },
      ],
    },
    {
      name: '机构管理',
      path: 'institution',
      authority: admin,
      children: [
        {
          name: '机构',
          path: 'list',
          authority: admin,
        },
        {
          name: '职级',
          path: 'grade',
          authority: admin,
        },
        {
          name: '管理员',
          path: 'instAdmin',
          authority: admin,
        },
      ]
    },
    {
      name: '活动管理',
      path: 'activities',
      authority: admin,
    },
    {
      name: '二维码管理',
      path: 'qr',
      authority: all,
      children: [
        {
          name: '码类型管理',
          path: 'type',
          authority: admin,
        },
        {
          name: '码批次管理',
          path: 'batch',
          authority: all,
        },
        {
          name: '码管理',
          path: 'listAll',
          authority: instAdmin,
        },
        {
          name: '创建码',
          path: 'create',
          authority: admin,
        },
      ]
    },

    // {
    //   name: '订单管理',
    //   path: 'order',
    //   authority: admin,
    // },
    // {
    //   name: '厂商管理',
    //   path: 'factory',
    //   authority: admin,
    // },
    // {
    //   name: '基础数据',
    //   path: 'dict',
    //   authority: admin, // todo 以上都是平台管理员的权限
    // },
  ];
};
