
import React from 'react';
import { Button, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class AccountVerificationSent extends React.Component {
  render() {
    let { email, message } = this.props
    return (
      <div className="AccountVerificationSent">
        <Message header='Check your email!' className='verticalformtopmessage' content={message} />
        <div className="signupVerificationEmailSent">
          <p>We’ve sent a message to <strong>{email}</strong>. Open it and click Activate My Account.</p>
        </div>
        <div className='verticalformbuttonrow'>
          <Button className="verticalformcontrol verticalformbottombutton" onClick={this.resendVerificationEmail}>Resend verification email</Button>
          <div style={{clear:'both' }} ></div>
        </div>
      </div>
    )
  }
}

AccountVerificationSent.propTypes = {
  email: PropTypes.string.isRequired,
  message: PropTypes.string
}

export default AccountVerificationSent
