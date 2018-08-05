import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function getCurrentUser() {
  return request('/api/user/getCurrentUser.action');
}

export async function getMenus() {
  return request('/api/user/getMenus.action', {
    method: 'GET',
  });
}
