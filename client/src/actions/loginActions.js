
export const LOGIN_REQUEST = 'LOGIN_REQUEST'

export function loginRequest(email, password) {
  return {
    type: LOGIN_REQUEST,
    email: email,
    password: password
  }
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user: user,
    receivedAt: Date.now()
  }
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function loginFailure(reason) {
  return {
    type: LOGIN_FAILURE,
    reason: reason,
    receivedAt: Date.now()
  }
}
