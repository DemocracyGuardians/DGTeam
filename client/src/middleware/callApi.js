
// Not currently used 
export const CALL_API = Symbol('callApi');

export default store => next => action => {
  if ( !action[CALL_API] ) {
    	return next(action);
  }
  let request = action[CALL_API];
  let { path, payload, responseActions, defaultAction } = request;
  let { dispatch } = store;

  var apiBaseUrl = "http://localhost:3001/api/";
  var fetchParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };
  fetch(apiBaseUrl+path, fetchParams).then(function(response) {
    let status = response.status;
    let actionType = responseActions[status] || defaultAction;
    dispatch({ type: actionType, body: response.body });
  })
  .catch(function (error) {
    dispatch({ type: defaultAction });
  })
}
