import {
  findRolePage,
  addRole,
  getRole,
  editRole,
  deleteRole,
  findResourceIdListByRoleId,
  grantRole,
} from '../services/api';

export default {
  namespace: 'sysrole',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findRolePage, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(findRolePage, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload }, { call, put }) {
      yield call(addRole, payload);
      yield put({
        type: 'fetch',
        payload: {},
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'getRole',
        payload: response.data,
      });
    },
    *edit({ payload }, { call, put }) {
      yield call(editRole, payload);
      yield put({
        type: 'fetch',
        payload: {},
      });
    },
    *del({ payload }, { call, put }) {
      yield call(deleteRole, payload);
      yield put({
        type: 'fetch',
        payload: {},
      });
    },
    *getTrees({ payload }, { call, put }) {
      const response = yield call(findResourceIdListByRoleId, payload);
      yield put({
        type: 'showTrees',
        payload: response.data,
      });
    },
    *grantRole({ payload }, { call, put }) {
      yield call(grantRole, payload);
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
    getRole(state, action) {
      return {
        ...state,
        systemrole: action.payload,
      };
    },
    showTrees(state, action) {
      return {
        ...state,
        treedatas: action.payload,
      };
    },
  },
};
