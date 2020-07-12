import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutation"
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const state = {
  cartList: []
}

const store = new Vuex.Store({
  state,
  //mutations的唯一目的就是修改state中状态
  //mutations的每个方法尽可能完成的事情比较单一一点
  mutations,
  actions,
  getters
})

export default store
