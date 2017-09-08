
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

export const USER_VERIFICATION_EMAIL_SENT = 'USER_VERIFICATION_EMAIL_SENT'

export function userVerificationEmailSent(email) {
  return {
    type: USER_VERIFICATION_EMAIL_SENT,
    email
  }
}
