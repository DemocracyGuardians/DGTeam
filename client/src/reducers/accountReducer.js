
import {
  USER_SIGNUP_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_VERIFICATION_EMAIL_SENT,
  RESET_PASSWORD_EMAIL_SENT
} from '../actions/accountActions'
import {
  GET_TASKS_SUCCESS
} from '../actions/tasksActions'
import {
  GET_INBOX_SUCCESS
} from '../actions/inboxActions'
import {
  GET_LESSON_SUCCESS,
  LESSON_UPDATE_PROGRESS_SUCCESS,
  LESSON_REVERT_PROGRESS_SUCCESS
} from '../actions/lessonActions'

export default function accountReducer(state = null, action) {
  switch (action.type) {
    case USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, action.account )
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, action.account )
    case USER_LOGOUT_SUCCESS:
      return null
    case USER_VERIFICATION_EMAIL_SENT:
      return Object.assign({}, state, { lastVerificationEmail: action.email } )
    case RESET_PASSWORD_EMAIL_SENT:
      return Object.assign({}, state, { lastResetPasswordEmail: action.email } )
    case GET_TASKS_SUCCESS:
    case GET_INBOX_SUCCESS:
    case GET_LESSON_SUCCESS:
    case LESSON_UPDATE_PROGRESS_SUCCESS:
    case LESSON_REVERT_PROGRESS_SUCCESS:
      return Object.assign({}, state, action.account )
    default:
      return state || null
  }
}
