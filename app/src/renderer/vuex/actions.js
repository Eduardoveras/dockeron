import * as types from './mutation-types'

import dockerHubApi from '../js/dockerHubApi'
import notify from '../js/notify'

export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}

export const login = function ({ commit }, credentials) {
  function loginSuccess (tokenResult) {
    commit(types.UPDATE_AUTH_TOKEN, tokenResult.token)
    commit(types.UPDATE_USERNAME, credentials.username)
    notify('Welcome, ' + credentials.username + ' !')
  }

  function loginFailed (err) {
    commit(types.REMOVE_AUTH_TOKEN)
    commit(types.REMOVE_USERNAME)
    notify(err)
  }

  dockerHubApi.login(credentials.username, credentials.password)
    .then(loginSuccess)
    .catch(loginFailed)
}

export const logout = function ({ state, commit }) {
  notify('Goodbye, ' + state.user.username + ' !')
  commit(types.REMOVE_AUTH_TOKEN)
  commit(types.REMOVE_USERNAME)
}
