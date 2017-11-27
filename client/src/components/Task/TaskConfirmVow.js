
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Message } from 'semantic-ui-react'
import { RSAA } from 'redux-api-middleware';
import TaskScreenBaseClass from './TaskScreenBaseClass'
import { accountLogoutSuccess } from '../../actions/accountActions'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import './TaskConfirmVow.css'

const logoutApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/logout'

class TaskConfirmVow extends TaskScreenBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      confirmed: 'notyet'
    }
    this.doLogout = this.doLogout.bind(this)
  }

  yes = (e) => {
    this.props.onScreenAdvance() // Tell TaskWizard to advance to next screen
  }

  no = (e) => {
    this.setState({ confirmed: 'no' })
    this.props.onRevertProgress()
  }

  doLogout() {
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
              dispatch(accountLogoutSuccess())
              this.props.history.push('/login')
            }
          },
          {
            type: 'logout_failure',
            payload: (action, state, res) => {
              console.error('logout_failure')
              this.props.history.push('/login')
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
    let { confirmed } = this.state
    let msg, noButtonText, noButtonFunc, yesButtonText
    if (confirmed === 'no') {
      msg = ( <Message className="TaskConfirmVowAreYouSure">
          <Message.Header>Another chance to agree</Message.Header>
          <p>Every team member must agree with all of the vows.
            If you cannot agree with this vow, you cannot advance further with organizational activities.</p>
          <p>Please press "I Agree" if you do indeed agree with this vow or press "Logout" to exit.</p>
        </Message> )
      yesButtonText = "I Agree"
      noButtonText = "Logout"
      noButtonFunc = this.doLogout
    } else {
      msg = ''
      yesButtonText = "Yes"
      noButtonText = "No"
      noButtonFunc = this.no
    }
    return (
      <div className="TaskConfirmVow" >
        <div className="TaskConfirmVowText" >
          {this.props.content}
        </div>
        {msg}
        <div className="TaskConfirmVowButtonRow">
          <span className="spacer"></span>
          <Button className="TaskConfirmVowButtonYes" onClick={this.yes} >{yesButtonText}</Button>
          <span className="spacer"></span>
          <Button className="TaskConfirmVowButtonNo" onClick={noButtonFunc} >{noButtonText}</Button>
          <span className="spacer"></span>
        </div>
      </div>
    );
  }
}

TaskConfirmVow.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onScreenComplete: PropTypes.func.isRequired,
  onScreenAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}

export default withRouter(TaskConfirmVow);
