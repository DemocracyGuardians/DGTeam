
import fetch from 'isomorphic-fetch'

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

export function loginFetch(email, password) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(loginRequest(email, password))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    var payload = {
      email,
      password
    }
    var url = "http://localhost:3001/api/login";
    var fetchParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(payload)
    };
    return fetch(url, fetchParams)
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occured.', error)
        //dispatch(loginFailure(error))
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(loginSuccess(json))
      )
  }
}
