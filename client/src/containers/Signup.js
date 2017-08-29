
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { RSAA } from 'redux-api-middleware';
import { SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE } from '../actions/signupActions'
import { userSignupSuccess } from '../actions/userActions'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input required name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />
const wPassword = (props) => <Input required name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />
const wFirstName = (props) => <Input required name='firstName' placeholder='First name' fluid className="verticalformcontrol" {...props} />
const wLastName = (props) => <Input required name='lastName' placeholder='Last name' fluid className="verticalformcontrol" {...props} />

class Signup extends React.Component {
  handleSubmit(values) {
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: "http://localhost:3001/api/signup",
        method: 'POST',
        types: [
          SIGNUP_REQUEST,
          {
            type: SIGNUP_SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                //FIXME handle error cases
                return res.json().then((json) => {
                  dispatch(userSignupSuccess(json.user))
                  this.props.history.push('/workbench')
                  return undefined
                })
              }
            }
          },
          SIGNUP_FAILURE
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
      <Container text className='Signup verticalformcontainer'>
        <Message header='Democracy Guardians Team Signup' className='verticalformtopmessage' error={error} content={message} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".firstName" type="text" component={wFirstName} />
          <Control.text model=".lastName" type="text" component={wLastName} />
          <Control.text model=".email" type="email" component={wEmail} />
          <Control.password model=".password" type="password" component={wPassword} />
          <Button type="submit" fluid className="verticalformcontrol verticalformbottombutton" >Signup</Button>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div>Already a team member?&nbsp;<Link to="/login">Login here</Link>.</div>
          </span>
        </Message>
      </Container>
    )
  }
}

Signup.propTypes = {
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
export default withRouter(connect(mapStateToProps)(Signup));
