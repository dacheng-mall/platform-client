import { getAuthority, checkAuthority } from '../../utils/authority';

const _checkAuthority = limitRoles => checkAuthority(limitRoles)(getAuthority());

export const menu = () => {
  const admin = _checkAuthority(['admin']);
  return [
    {
      name: '概览',
      path: 'overview',
      authority: admin,
      icon: 'iconfont icon-global',
    },
    {
      name: '用户管理',
      authority: admin,
      path: 'users',
      children: [
        {
          name: '平台管理员',
          path: 'admin',
          authority: admin,
        },
        {
          name: '机构',
          path: 'institution',
          authority: admin,
        },
        {
          name: '业务员',
          path: 'seller',
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
          name: '首页管理',
          path: 'home',
          authority: admin,
        },
      ],
    },
    {
      name: '厂商管理',
      path: '',
      authority: admin,
    },
    {
      name: '基础数据',
      path: 'dict',
      authority: admin, // todo 以上都是平台管理员的权限
    },
  ];
};
