
import {
  USER_LOGIN_SUCCESS
} from '../actions/userActions'

export default function userReducer(state = null, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, action.user)
    default:
      return state || null
  }
}
