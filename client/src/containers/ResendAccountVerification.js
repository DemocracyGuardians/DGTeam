
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import { userVerificationEmailSent } from '../actions/userActions'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'
var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED'

var resendverificationApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resendverification'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />

class ResendAccountVerification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: null,
      error: false
    }
  }

  handleSubmit(values) {
    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    fetch(resendverificationApiUrl, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(values),
      //mode: 'cors',
      //cache: 'default',
      headers
    }).then(res => {
      if (res.status === 200) {
        this.props.store.dispatch(userVerificationEmailSent(values.email))
        this.props.history.push('/verificationsent')
      } else {
        const contentType = res.headers.get('Content-Type');
        if (contentType && ~contentType.indexOf('json')) {
          return res.json().then((json) => {
            console.error('ResendAccountVerification post error. status='+res.status+', json='+JSON.stringify(json))
            let { error } = json
            if (error === EMAIL_ALREADY_VERIFIED) {
              this.setState({ message: 'Email has already been verified. Please login.',  error: true })
            } else if (error === EMAIL_NOT_REGISTERED) {
              this.setState({ message: 'Email has not been registered yet. Please enter a different email or sign up.',  error: true })
            } else {
              this.props.history.push('/systemerror')
            }
          }).catch((error)  => {
            console.error('ResendAccountVerification json() error='+error)
            this.props.history.push('/systemerror')
          })
        } else {
          console.error('ResendAccountVerification contentType not parseable json')
          this.props.history.push('/systemerror')
        }
      }
    }).catch(error => {
      console.error('ResendAccountVerification post error. error='+error)
      this.props.history.push('/systemerror')
    });
  }

  render() {
    let hdr = 'Resend Account Verification'
    let { message, error } = this.state
    return (
      <Container text className='ResendAccountVerification verticalformcontainer'>
        <Message header={hdr} className='verticalformtopmessage' content={message} error={error} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} />
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Resend Account Verification</Button>
            <div style={{clear:'both' }} ></div>
          </div>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div>Account already verified?&nbsp;<Link to="/login">Login here</Link></div>
          </span>
        </Message>
      </Container>
    )
  }
}

ResendAccountVerification.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

export default withRouter(connect(mapStateToProps)(ResendAccountVerification));
