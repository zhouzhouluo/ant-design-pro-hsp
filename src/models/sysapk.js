import { findApkPage, addApk } from '../services/api';

export default {
  namespace: 'sysapk',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findApkPage, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(findApkPage, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload }, { call, put }) {
      yield call(addApk, payload);
      yield put({
        type: 'fetch',
        payload: {},
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
