// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('antd-pro-authority') || ['admin', 'user', 'luoyizhou'];
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function getToken() {
  const tokenStr = localStorage.getItem('security.token');
  if (!tokenStr) {
    return null;
  }

  const token = JSON.parse(tokenStr);
  return token;
}

export function getAccessToken() {
  try {
    const tokenStr = getToken();
    if (!tokenStr) {
      return '';
    }
    return tokenStr.access_token;
  } catch (error) {
    return '';
  }
}

export function setToken(token) {
  return localStorage.setItem('security.token', JSON.stringify(token));
}
