
import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import PropTypes from 'prop-types'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var workbenchinitApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/workbenchinit'
var logoutApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/logout'

class Workbench extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //password: ''
    }
    this.workbenchinit = this.workbenchinit.bind(this);
    this.logout = this.logout.bind(this);
  }

  workbenchinit() {
    let values = {}
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: workbenchinitApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'workbenchinit_request', // ignored
          {
            type: 'workbenchinit_success',
            payload: (action, state, res) => {
              console.log('workbenchinit_success')
            }
          },
          {
            type: 'workbenchinit_failure',
            payload: (action, state, res) => {
              console.log('workbenchinit_failure')
            }
          }
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  logout() {
    let values = {}
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: logoutApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'logout_request', // ignored
          {
            type: 'logout_success',
            payload: (action, state, res) => {
              console.log('logout_success')
            }
          },
          {
            type: 'logout_failure',
            payload: (action, state, res) => {
              console.log('logout_failure')
            }
          }
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  render() {
    this.workbenchinit()
    return (
      <div className="workbench">
        <div>User workbench</div>
        <div><Link onClick={this.logout} to="/login">Logout</Link></div>
      </div>
    );
  }
}

Workbench.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Workbench);
