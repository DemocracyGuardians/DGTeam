
import {
  USER_SIGNUP_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_VERIFICATION_EMAIL_SENT,
  RESET_PASSWORD_EMAIL_SENT
} from '../actions/userActions'

export default function userReducer(state = null, action) {
  switch (action.type) {
    case USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, action.user)
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, action.user)
    case USER_VERIFICATION_EMAIL_SENT:
      return Object.assign({}, state, { lastVerificationEmail: action.email } )
    case RESET_PASSWORD_EMAIL_SENT:
      return Object.assign({}, state, { lastResetPasswordEmail: action.email } )
    default:
      return state || null
  }
}
