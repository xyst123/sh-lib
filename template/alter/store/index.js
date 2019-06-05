import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import video from './modules/video';
import article from './modules/article';

Vue.use(Vuex);

// 根级别的state，非全局状态建议分模块写在modules里
const state = {};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    video,
    article,
  },
});
