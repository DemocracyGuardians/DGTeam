
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'

export function userLoginSuccess(user) {
  return {
    type: USER_LOGIN_SUCCESS,
    user
  }
}

export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS'

export function userSignupSuccess(user) {
  return {
    type: USER_SIGNUP_SUCCESS,
    user
  }
}
