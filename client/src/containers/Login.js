
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
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />
const wPassword = (props) => <Input name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showPassword: false
    }
    this.toggleShowPassword = this.toggleShowPassword.bind(this)
  }

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

  toggleShowPassword(event) {
    event.preventDefault()
    // Use setTimeout because can't update state while rendering
    setTimeout(() => {
      this.setState({ showPassword: !this.state.showPassword })
    })
  }

  render() {
    let { message, error } = this.props
    let { showPassword } = this.state
    let passwordType = showPassword ? 'input' : 'password'
    let showHidePasswordText = showPassword ? 'Hide password' : 'Show password'
    return (
      <Container text className='Login verticalformcontainer'>
        <Message header='Democracy Guardians Team Login' className='verticalformtopmessage' error={error} content={message} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} />
          <Control.password type={passwordType} model=".password" component={wPassword} />
          <div className="showPasswordRow">
            <a href="" className="showPasswordLink" onClick={this.toggleShowPassword} >{showHidePasswordText}</a>
          </div>
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Login</Button>
            <div style={{clear:'both' }} ></div>
          </div>
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
