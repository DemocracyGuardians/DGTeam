
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actions/loginActions'

function loginReducer(state = {
    currentScreen: 'Login',
    isFetching: false,
    message: ''
  }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        message: 'Verifying...'
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentScreen: 'Workbench',
        isFetching: false,
        message: ''
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        currentScreen: 'Login',
        isFetching: false,
        message: 'Login failure: ' + action.errorMessage
      })
    default:
      return state || null
  }
}

export default loginReducer
