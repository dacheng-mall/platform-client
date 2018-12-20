import { getAuthority, checkAuthority } from '../../utils/authority';

// const _checkAuthority = limitRoles => checkAuthority(limitRoles)(getAuthority());
const free = limitRoles => checkAuthority(limitRoles)();

export const menu = () => {
  // const application = _checkAuthority(['USER']),
  //   management = _checkAuthority(['ADMIN']);
    const any = free();
  return [
    {
      name: '概览',
      path: '/overview',
      authority: any,
      icon: 'iconfont icon-global',
    },
    {
      name: '用户管理',
      authority: any,
      path: '/users',
      children: [
        {
          name: '机构',
          path: '/institution',
          authority: any,
        },
        {
          name: '人员',
          path: '/sellers',
          authority: any,
        },
        {
          name: '平台管理员',
          path: '/admins',
          authority: any,
        },
      ],
    },
    {
      name: '商品管理',
      authority: any,
      path: '/products',
      children: [
        {
          name: '自营商品',
          path: '/self',
          authority: any,
        },
        {
          name: '第三方商品',
          path: '/third',
          authority: any,
        },
      ],
    },
    {
      name: '内容管理',
      path: '/content',
      authority: any,
      children: [
        {
          name: '素材管理',
          path: '/elements',
          authority: any,
        },
        {
          name: '首页管理',
          path: '/home',
          authority: any,
        },
      ],
    },
    {
      name: '厂商管理',
      path: '',
      authority: any,
    },
    {
      name: '基础数据',
      path: '/dict',
      authority: any, // todo 以上都是平台管理员的权限
    },
  ];
};
