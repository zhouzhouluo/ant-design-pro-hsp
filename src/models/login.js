import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      // Login successfully
      if (response.code === 200) {
        reloadAuthorized();
        setToken(response.data);

        // yield put({
        //   type: 'user/getMenus',
        // });

        const urlParams = new URL(window.location.href);

        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          data: { currentAuthority: 'guest' },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.code === 200) {
        setAuthority(payload.data.currentAuthority);
      } else {
        setAuthority('guest');
      }

      return {
        ...state,
        status: payload.code,
        type: payload.type,
      };
    },
  },
};
