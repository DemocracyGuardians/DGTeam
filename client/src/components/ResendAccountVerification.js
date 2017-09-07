
import React from 'react';
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import AccountVerificationSent from '../components/AccountVerificationSent'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'
var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
var INCORRECT_PASSWORD = 'INCORRECT_PASSWORD'

const resendverificationApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resendverification'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />

class ResendAccountVerification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      buttonPressed: false,
      email: null
    }
  }

  handleSubmit(values) {
    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    fetch(resendverificationApiUrl, {
      method: "POST",
      body: JSON.stringify(values),
      //mode: 'cors',
      //cache: 'default',
      headers
    }).then(res => {
      if (res.status === 200) {
        this.setState({ buttonPressed: true, email: values.email })
      } else {
        console.error('ResendAccountVerification post error. status='+res.status+', res.body='+JSON.stringify(res.body))
        this.props.history.push('/systemerror')
      }
    }).catch(error => {
      console.error('ResendAccountVerification post error. error='+error)
      this.props.history.push('/systemerror')
    });
  }

  render() {
    let { buttonPressed, email } = this.state
    let formStyle = buttonPressed ? { display: 'block' } : { display: 'none' }
    let sentStyle = buttonPressed ? { display: 'none' } : { display: 'block' }
    let hdr = 'Resend Account Verification'
    return (
      <Container text className='ResendAccountVerification verticalformcontainer'>
        <div style={formStyle} >
          <Message header={hdr} className='verticalformtopmessage' />
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
        </div>
        <div style={sentStyle} >
          <AccountVerificationSent email={email} />
        </div>
      </Container>
    )
  }
}

export default withRouter(ResendAccountVerification)
