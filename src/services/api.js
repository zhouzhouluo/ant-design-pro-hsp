import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account.action', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function findUserPage(params) {
  return request('/api/sys/systemUser/findUserPage.action', {
    method: 'POST',
    body: params,
  });
}

export async function findRolePage(params) {
  return request('/api/sys/systemRole/findRolePage.action', {
    method: 'POST',
    body: params,
  });
}

export async function addRole(params) {
  return request('/api/sys/systemRole/addRole.action', {
    method: 'POST',
    body: params,
  });
}

export async function getRole(id) {
  return request(`/api/sys/systemRole/getRole/${id}.action`, {
    method: 'GET',
  });
}

export async function editRole(params) {
  return request(`/api/sys/systemRole/edit.action`, {
    method: 'POST',
    body: params,
  });
}
export async function deleteRole(id) {
  return request(`/api/sys/systemRole/delete/${id}.action`, {
    method: 'GET',
  });
}
export async function showAllTrees() {
  return request(`/api/sys/systemResource/showAllTrees.action`, {
    method: 'GET',
  });
}
export async function findResourceIdListByRoleId(id) {
  return request(`/api/sys/systemRole/findResourceIdListByRoleId/${id}.action`, {
    method: 'GET',
  });
}

export async function grantRole(params) {
  return request(`/api/sys/systemRole/grant.action`, {
    method: 'POST',
    body: params,
  });
}

export async function findApkPage(params) {
  return request('/api/sys/apk/findApkPage.action', {
    method: 'POST',
    body: params,
  });
}
export async function addApk(params) {
  return request('/api/sys/apk/upload.action', {
    method: 'POST',
    body: params,
  });
}
