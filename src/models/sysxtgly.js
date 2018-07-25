import { findUserPage } from '../services/api';

export default {
  namespace: 'sysxtgly',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findUserPage, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(findUserPage, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        data: state.list.concat(action.payload),
      };
    },
  },
};
