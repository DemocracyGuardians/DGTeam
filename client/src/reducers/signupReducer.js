
import { SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE } from '../actions/signupActions'

function signupReducer(state = {
    message: '',
    error: false
  }, action) {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return Object.assign({}, state, {
        message: 'Verifying...',
        error: false
      })
    case SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        message: '',
        error: false
      })
    case SIGNUP_FAILURE:
      return Object.assign({}, state, {
        message: 'Signup failure: ' + action.errorMessage,
        error: true
      })
    default:
      return state || null
  }
}

export default signupReducer
