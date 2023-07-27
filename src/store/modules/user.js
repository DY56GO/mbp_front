import Vue from 'vue'
import { register, login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    // ensure data refresh
    Vue.set(state, 'token', '')
    Vue.set(state, 'name', '')
    Vue.set(state, 'avatar', '')
    Vue.set(state, 'menus', {})
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user register
  register({ commit }, userInfo) {
    const { username, password, checkPassword, captchaId, captcha } = userInfo
    return new Promise((resolve, reject) => {
      register({ userAccount: username.trim(), userPassword: password, checkPassword: checkPassword, captchaId: captchaId, captcha: captcha }).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password, captchaId, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ userAccount: username.trim(), userPassword: password, captchaId: captchaId, captcha: captcha }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { userAccount, userAvatar, userMenuTree } = data

        commit('SET_NAME', userAccount)
        commit('SET_AVATAR', userAvatar)
        commit('SET_MENUS', userMenuTree)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

