/* eslint-disable no-unused-vars */
import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '系统管理',
    icon: 'dashboard',
    path: 'sys',
    // authority: 'luoyizhou',
    children: [
      {
        name: '管理员管理',
        path: 'xtgly-list',
      },
      {
        name: '角色管理',
        path: 'role-list',
      },
      {
        name: '资源管理',
        path: '1',
      },
      {
        name: 'APK管理',
        path: 'apk-list',
      },
      {
        name: '设备管理',
        path: '3',
      },
    ],
  },
  {
    name: '日志管理',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '请求日志',
        path: 'table-list',
      },
    ],
  },

  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

//
// const menuData = [
//   {
//     name: '系统管理',
//     icon: 'dashboard',
//     path: 'sys',
//   },
// ];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = menuDatas => {
  if (!menuDatas) {
    return formatter([]);
  } else {
    return formatter(menuDatas);
  }
};
