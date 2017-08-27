
/*
<Form.Group widths='equal'>
  <Form.Input label='First Name' placeholder='First Name' type='text' />
  <Form.Input label='Last Name' placeholder='Last Name' type='text' />
</Form.Group>
*/

import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input required name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />
const wPassword = (props) => <Input required name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />

class Login extends React.Component {
  handleSubmit(values) {
    this.props.onSubmitLogin(values);
  }

  render() {
    let { message, error } = this.props
    return (
      <Container text className='Login verticalformcontainer'>
        <Message header='Democracy Guardians Team Login' className='verticalformtopmessage' error={error} content={message} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} />
          <Control.password model=".password" type="password" component={wPassword} />
          <Button type="submit" fluid className="verticalformcontrol verticalformbottombutton" >Login</Button>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div><a href='#'>Forgot your password?</a></div>
            <div>Not yet a team member?&nbsp;<a href='#'>Signup here</a>.</div>
          </span>
        </Message>
      </Container>
    )
  }
}

Login.propTypes = {
  message: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  onSubmitLogin: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { currentScreen, message, error } = state || {}
  return {
    store: ownProps.store,
    currentScreen,
    message,
    error
  }
}
export default connect(mapStateToProps)(Login);
