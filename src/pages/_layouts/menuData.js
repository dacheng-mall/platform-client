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
  const all = _checkAuthority([1, 3]);
  const all2 = _checkAuthority([1, 5]);
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
        // {
        //   name: '机构管理员',
        //   icon: 'iconfont icon-user',
        //   path: 'instAdmin',
        //   authority: instAdmin,
        // },
      ],
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
        // {
        //   name: '业务员',
        //   path: 'seller',
        //   authority: admin,
        // },
        {
          name: '业务员管理',
          icon: 'iconfont icon-user',
          path: 'salesmans',
          authority: admin,
        },
        {
          name: '客户',
          path: 'customer',
          authority: admin,
        },
        {
          name: '业务员审核',
          path: 'attestation',
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
      ],
    },
    {
      name: '活动管理',
      authority: admin,
      path: 'activities',
      children: [
        {
          name: '活动类型',
          path: 'type',
          authority: admin,
        },
        {
          name: '活动列表',
          path: 'list',
          authority: admin,
        },
      ],
    },
    {
      name: '二维码管理',
      path: 'qr',
      authority: admin,
      children: [
        {
          name: '码类型管理',
          path: 'type',
          authority: admin,
        },
        {
          name: '码批次管理',
          path: 'batch',
          authority: admin,
        },
        {
          name: '码管理',
          path: 'listAll',
          authority: admin,
        },
        {
          name: '创建码',
          path: 'create',
          authority: admin,
        },
      ],
    },
    {
      name: '兑换管理',
      path: 'convert',
      authority: admin,
      children: [
        {
          name: '礼包管理',
          path: 'prizes',
          authority: admin,
        },
        {
          name: '电子兑换券管理',
          path: 'tickets',
          authority: admin,
        },
      ],
    },
    {
      name: '交易管理',
      path: 'trade',
      authority: all2,
      children: [
        {
          name: '订单管理',
          path: 'orders',
          authority: all2,
        },
        {
          name: '发货',
          path: 'sending',
          authority: all2,
        },
        {
          name: '物流模板',
          path: 'logistics-template',
          authority: all2,
        },
        {
          name: '物流公司',
          path: 'logistic-companies',
          authority: admin,
        },
      ],
    },
    {
      name: '工牌商城',
      authority: admin,
      icon: 'iconfont icon-shopOutlined',
      path: 'mall',
      children: [
        {
          name: "商品分类",
          path: "categories",
          authority: admin,
        },
        {
          name: "商品库",
          path: "products",
          authority: admin,
        },
        {
          name: "订单管理",
          path: "orders",
          authority: admin,
        }
      ]
    },
    {
      name: '商城会员',
      authority: admin,
      icon: 'iconfont icon-shopOutlined',
      path: 'vip',
      children: [
        {
          name: "会员卡产品",
          path: "card",
          authority: admin,
        },
        {
          name: "会员卡订单",
          path: "vipOrders",
          authority: admin,
        },
        {
          name: "邀请奖励管理",
          path: "commission",
          authority: admin,
        }
      ]
    },
    {
      name: '基础数据管理',
      path: 'dict',
      authority: admin,
      children: [
        {
          name: '字典类型',
          path: 'sys',
          authority: admin,
        },
        {
          name: '地区',
          path: 'region',
          authority: admin,
        },
      ],
    },
    {
      name: '任务管理',
      path: 'mission',
      authority: all,
      children: [
        {
          name: '任务列表',
          path: 'task',
          authority: instAdmin,
        },
        {
          name: '任务列表',
          path: 'task',
          authority: admin,
        },
        {
          name: '任务奖励',
          path: 'prize',
          authority: admin,
        },
      ],
    },
    {
      name: '基础管理',
      path: 'baseManage',
      authority: all,
      children: [
        {
          name: '拜访记录',
          path: 'visited',
          authority: all,
        },
        {
          name: '出勤记录',
          path: 'attendance',
          authority: all,
        },
        {
          name: '实体工牌管理',
          path: 'badge',
          authority: admin,
        },
        {
          name: '线上拜访入口资源',
          path: 'onlineVisitedEntry',
          authority: admin,
        },
        {
          name: '线上拜访分享资源',
          path: 'onlineVisitedShare',
          authority: admin,
        }
      ],
    },
    {
      name: '活动管理',
      path: 'gathering',
      authority: all,
      children: [
        {
          name: '抢购活动列表',
          path: 'active',
          authority: all,
        },
        {
          name: '活动商品',
          path: 'product',
          authority: admin,
        },
      ],
    },
  ];
};
