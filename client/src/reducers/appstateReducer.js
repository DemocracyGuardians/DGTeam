
import {
  APPSTATE_LOGIN_SUCCESS
} from '../actions/appstateActions'

export default function appstateReducer(state = {
    currentScreen: 'Login'
  }, action) {
  switch (action.type) {
    case APPSTATE_LOGIN_SUCCESS:
      return Object.assign({}, state, {
      })
    default:
      return state || null
  }
}
