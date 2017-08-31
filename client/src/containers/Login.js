
/*
<Form.Group widths='equal'>
  <Form.Input label='First Name' placeholder='First Name' type='text' />
  <Form.Input label='Last Name' placeholder='Last Name' type='text' />
</Form.Group>
*/

import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { RSAA } from 'redux-api-middleware';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/loginActions'
import { userLoginSuccess } from '../actions/userActions'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input required name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />
const wPassword = (props) => <Input required name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />

class Login extends React.Component {
  handleSubmit(values) {
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: "http://localhost:3001/api/login",
        method: 'POST',
        types: [
          LOGIN_REQUEST,
          {
            type: LOGIN_SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                //FIXME handle error cases
                return res.json().then((json) => {
                  dispatch(userLoginSuccess(json.user))
                  this.props.history.push('/workbench')
                  return undefined
                })
              }
            }
          },
          LOGIN_FAILURE
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
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
            <div>Not yet a team member?&nbsp;<Link to="/signup">Signup here</Link></div>
          </span>
        </Message>
      </Container>
    )
  }
}

Login.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { message, error } = state || {}
  return {
    store: ownProps.store,
    message,
    error
  }
}
export default withRouter(connect(mapStateToProps)(Login));
