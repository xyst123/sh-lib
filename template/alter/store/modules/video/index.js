const types = {
  CHANGE_EXAMPLE: 's2.change_example',
};

// initial state
const state = {
  example: false,
};

// getters
const getters = {
  's2.getExample': state => state.example,
};

// actions
const actions = {
  's2.changeExample': function ({ commit }) {
    commit(types.CHANGE_EXAMPLE);
  },
};

// mutations
const mutations = {
  [types.CHANGE_EXAMPLE](state) {
    state.example = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
