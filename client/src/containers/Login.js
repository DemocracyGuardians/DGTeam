
import React, { Component } from 'react';
import { Button, Container, Form, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types';

class Login extends Component {
  render() {
    let { message, error, onSubmitLogin } = this.props
    return (
      <Container text className='Login'>
        <Message header='Democracy Guardians Team Login' error={error} attached content={message} />
        <Form className='attached fluid segment' onSubmit={onSubmitLogin}>
          <Form.Input name='email' placeholder='Email' />
          <Form.Input name='password' type='password' placeholder='Password'/>
          <Button type="submit">Login</Button>
        </Form>
        <Message attached='bottom'>
          <span className='innerBlock'>
            <div><a href='#'>Forgot your password</a></div>
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

export default Login

/*
<Form.Group widths='equal'>
  <Form.Input label='First Name' placeholder='First Name' type='text' />
  <Form.Input label='Last Name' placeholder='Last Name' type='text' />
</Form.Group>
*/
