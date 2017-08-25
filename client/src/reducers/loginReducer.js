
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actions/loginActions'

function loginReducer(state = {
    currentScreen: 'Login',
    message: '',
    error: false
  }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        message: 'Verifying...',
        error: false
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentScreen: 'Workbench',
        message: '',
        error: false
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        currentScreen: 'Login',
        message: 'Login failure: ' + action.errorMessage,
        error: true
      })
    default:
      return state || null
  }
}

export default loginReducer
