import { getAuthority, checkAuthority } from '../../utils/authority';

const _checkAuthority = limitRoles => checkAuthority(limitRoles)(getAuthority());
const free = limitRoles => checkAuthority(limitRoles)();

export const menu = () => {
  const application = _checkAuthority(['USER']),
    management = _checkAuthority(['ADMIN']),
    any = free();
  return [
    {
      name: '概览',
      path: '/overview',
      authority: any,
      icon: 'iconfont icon-global',
    },
  ];
};
