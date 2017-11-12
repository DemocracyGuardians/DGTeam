
import {
  USER_SIGNUP_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_VERIFICATION_EMAIL_SENT,
  RESET_PASSWORD_EMAIL_SENT
} from '../actions/accountActions'

export default function accountReducer(state = null, action) {
  switch (action.type) {
    case USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, { account: action.account} )
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, { account: action.account} )
    case USER_LOGOUT_SUCCESS:
      return Object.assign({}, state, { account: null })
    case USER_VERIFICATION_EMAIL_SENT:
      return Object.assign({}, state, { lastVerificationEmail: action.email } )
    case RESET_PASSWORD_EMAIL_SENT:
      return Object.assign({}, state, { lastResetPasswordEmail: action.email } )
    default:
      return state || null
  }
}
