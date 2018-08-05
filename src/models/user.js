/* eslint-disable no-unused-vars */
import { query as queryUsers, queryCurrent, getCurrentUser, getMenus } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *fetchCurrent(_, { call, put }) {
    //   const response = yield call(getCurrentUser);
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    *getMenus(_, { call, put }) {
      const response = yield call(getMenus);
      yield put({
        type: 'changeLayoutMenuData',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeLayoutMenuData(state, action) {
      return {
        ...state,
        usermenuData: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
