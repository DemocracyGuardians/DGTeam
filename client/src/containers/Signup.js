
/* todo
vows
members agreement
text for pane 4
button on pane 4 to resend email
login if user is not yet confirmed screen to send email again, also if user clicks forgot password?
banner
put checkboxes outside of labels
*/
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { RSAA } from 'redux-api-middleware'
import Marked from 'marked'
import vowsMd from '../components/Trustworthiness_Vows_md'
import agreementMd from '../components/Members_Agreement_md'
import { SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE } from '../actions/signupActions'
import { userSignupSuccess } from '../actions/userActions'

const passwordRegexp = "^(?=.{8,32}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).*"

// Wrap semantic-ui controls for react-redux-forms
const wFirstName = (props) => <Input name='firstName' placeholder='First name' fluid {...props} />
const wLastName = (props) => <Input name='lastName' placeholder='Last name' fluid {...props} />
const wEmail = (props) => <Input name='email' placeholder='Email' fluid {...props} />
const wPassword = (props) => <Input name='password' placeholder='Password' fluid {...props} />

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // this.props.message from parent holds initial message and is usually ''
      // this.state.message holds message to display at top of form
      message: this.props.message,
      // this.props.error from parent indicates whether initial message is an error and is usually false
      // this.state.error is a boolean that indicates whether message is an error
      error: this.props.error,
      emailAlreadyRegistered: false,
      showPassword: false,
      needToValidatePane1: false,
      needToValidatePane2: false,
      needToValidatePane3: false,
      pane: 1,
      email: null // only given a value after successful submit
    }
    this.validatePane1 = this.validatePane1.bind(this)
    this.validatePane2 = this.validatePane2.bind(this)
    this.validatePane3 = this.validatePane3.bind(this)
    this.validatePane1Error = this.validatePane1Error.bind(this)
    this.validatePane2Error = this.validatePane2Error.bind(this)
    this.validatePane3Error = this.validatePane3Error.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
    this.onClickNext1 = this.onClickNext1.bind(this)
    this.onClickPrev2 = this.onClickPrev2.bind(this)
    this.onClickNext2 = this.onClickNext2.bind(this)
    this.onClickPrev3 = this.onClickPrev3.bind(this)
    this.toggleShowPassword = this.toggleShowPassword.bind(this)
    this.resendVerificationEmail = this.resendVerificationEmail.bind(this)
  }

  validatePane1() {
    let invalidFields = []
    let f = document.querySelector('.Signup form');
    ['firstName','lastName','email','password'].forEach(function(field) {
      let localdot = 'local.' + field
      if (!f[localdot].validity.valid) {
        invalidFields.push(field)
      }
    })
    return invalidFields
  }

  validatePane1Error(invalidFields) {
    if (invalidFields.length === 1 && invalidFields[0] === 'password') {
      this.setState({ error: true, message: 'Password must have at least 8 characters and must include at least one uppercase, one lowercase, one number and one punctuation character', pane: 1 })
    } else {
      this.setState({ error: true, message: 'The highlighted fields are in error', pane: 1 })
    }
  }

  validatePane2() {
    let f = document.querySelector('.Signup form')
    if (!f['local.vows'].checked) {
      return false
    } else {
      return true
    }
  }

  validatePane2Error() {
    this.setState({ error: true, message: 'You must commit to the vows in order to sign up.', pane: 2 })
  }

  validatePane3() {
    let f = document.querySelector('.Signup form')
    if (!f['local.agreement'].checked) {
      return false
    } else {
      return true
    }
  }

  validatePane3Error() {
    this.setState({ error: true, message: 'You must agree to the terms of the Members Agreement in order to sign up.', pane: 3 })
  }

  clearErrors() {
    this.setState({ error: false, message: '', emailAlreadyRegistered: false })
  }

  onClickNext1(event) {
    event.preventDefault()
    this.setState({ needToValidatePane1: true })
    // force rerender, use setTimeout so that html5 required property will kick in on firstName and lastName
    this.forceUpdate()
    setTimeout(() => {
      var invalidFields = this.validatePane1()
      if (invalidFields.length > 0) {
        this.validatePane1Error(invalidFields)
        return
      }
      let { dispatch } = this.props.store
      let f = document.querySelector('.Signup form')
      var email = f['local.email'].value
      var payload = { email }
      const apiAction = {
        [RSAA]: {
          endpoint: "http://localhost:3001/api/loginexists",
          method: 'POST',
          types: [
            'ignored',
            {
              type: 'signup_loginexists_success',
              payload: (action, state, res) => {
                const contentType = res.headers.get('Content-Type');
                if (contentType && ~contentType.indexOf('json')) {
                  //FIXME handle error cases
                  return res.json().then((json) => {
                    if (json.exists) {
                      this.setState({ error: true, message: 'Email '+email+' already has an account', emailAlreadyRegistered: true })
                    } else {
                      this.clearErrors()
                      this.setState({ pane: 2 })
                    }
                    return undefined
                  })
                }
              }
            },
            {
              type: 'signup_loginexists_failure',
              payload: (action, state, res) => {
                this.setState({ error: true, message: 'Unknown error. Maybe server is unavailable.' })
              }
            }
          ],
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        }
      }
      dispatch(apiAction)
    }, 0)
  }

  onClickPrev2(event) {
    event.preventDefault()
    var invalidFields = this.validatePane1()
    if (invalidFields.length > 0) {
      this.validatePane1Error(invalidFields)
      return
    }
    this.clearErrors()
    this.setState({ pane: 1 })
  }

  onClickNext2(event) {
    event.preventDefault()
    this.setState({ needToValidatePane2: true })
    if (!this.validatePane2()) {
      this.validatePane2Error()
      return
    }
    var invalidFields = this.validatePane1()
    if (invalidFields.length > 0) {
      this.validatePane1Error(invalidFields)
      return
    }
    this.clearErrors()
    this.setState({ pane: 3 })
  }

  onClickPrev3(event) {
    event.preventDefault()
    if (!this.validatePane2()) {
      this.validatePane2Error()
      return
    }
    var invalidFields = this.validatePane1()
    if (invalidFields.length > 0) {
      this.validatePane1Error(invalidFields)
      return
    }
    this.clearErrors()
    this.setState({ pane: 2 })
  }

  handleChange(values) {
    var invalidFields = this.validatePane1()
    if (this.state.pane === 1 && this.state.needToValidatePane1 && invalidFields.length > 0) {
      this.validatePane1Error(invalidFields)
      return
    }
    if (this.state.pane === 2 && this.state.needToValidatePane2 && !this.validatePane2()) {
      this.validatePane2Error()
      return
    }
    if (this.state.pane === 3 && this.state.needToValidatePane3 && !this.validatePane3()) {
      this.validatePane3Error()
      return
    }
    this.clearErrors()
  }

  handleSubmit(values) {
    this.setState({ needToValidatePane3: true })
    if (!this.validatePane3()) {
      this.validatePane3Error()
      return
    }
    if (!this.validatePane2()) {
      this.validatePane2Error()
      return
    }
    var invalidFields = this.validatePane1()
    if (invalidFields.length > 0) {
      this.validatePane1Error(invalidFields)
      return
    }
    this.clearErrors()
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
                  this.setState({ email: json.user.email, pane: 4 })
                  return undefined
                })
              }
            }
          },
          SIGNUP_FAILURE //FIXME Need error handling
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  toggleShowPassword(event) {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
  }

  resendVerificationEmail(event) {
    event.stopPropagation()
    alert('not yet implemented')
  }

  render() {
    let { pane, error, needToValidatePane1, needToValidatePane2, needToValidatePane3, emailAlreadyRegistered, showPassword, email } = this.state
    let message = this.state.message || (this.state.pane <= 3 ? `Step ${pane} of 3` : '')
    let pane1style = { display: (pane === 1 ? 'block' : 'none') }
    let pane2style = { display: (pane === 2 ? 'block' : 'none') }
    let pane3style = { display: (pane === 3 ? 'block' : 'none') }
    let pane4style = { display: (pane === 4 ? 'block' : 'none') }
    let pane1required = needToValidatePane1
    let passwordPattern = needToValidatePane1 ? passwordRegexp : '.*'
    let passwordType = showPassword ? 'input' : 'password'
    let showHidePasswordText = showPassword ? 'Hide password' : 'Show password'
    let emailClass = 'verticalformcontrol ' + (emailAlreadyRegistered ? 'emailError' : '' )
    let vowsClass = 'verticalformcontrol ' + (needToValidatePane2 && !this.validatePane2() ? 'checkboxDivError' : '' )
    let agreementClass = 'verticalformcontrol ' + (needToValidatePane3 && !this.validatePane3() ? 'checkboxDivError' : '' )
    let vowsHtml = Marked(vowsMd);
    let agreementHtml = Marked(agreementMd);
    return (
      <Container text className='Signup verticalformcontainer'>
        <LocalForm onSubmit={(values) => this.handleSubmit(values)}
            onChange={(values) => this.handleChange(values)}>
          <div style={pane1style}>
            <Message header='Democracy Guardians Team Signup' className='verticalformtopmessage' error={error} content={message} />
            <Control.text model=".firstName" type="text" className="verticalformcontrol" component={wFirstName} required={pane1required} />
            <Control.text model=".lastName" type="text" className="verticalformcontrol" component={wLastName} required={pane1required} />
            <Control.text model=".email" type="email" className={emailClass} component={wEmail} required={pane1required} />
            <Control.password model=".password" type={passwordType} className="verticalformcontrol" pattern={passwordPattern} component={wPassword} required={pane1required} />
            <div className="showPasswordRow">
              <a href="" className="showPasswordLink" onClick={this.toggleShowPassword} >{showHidePasswordText}</a>
            </div>
            <div className="passwordRules">At least: 1 lowercase, 1 uppercase, 1 number, 1 punctuation, 8 chars total</div>
            <div className='verticalformbuttonrow'>
              <Button className="verticalformcontrol verticalformbottombutton" onClick={this.onClickNext1} floated='right'>Next</Button>
              <div style={{clear:'both' }} ></div>
            </div>
            <Message className="verticalformbottommessage" >
              <span className='innerBlock'>
                <div>Already a team member?&nbsp;<Link to="/login">Login here</Link></div>
              </span>
            </Message>
          </div>
          <div style={pane2style}>
            <Message header='Democracy Guardians Team Signup' className='verticalformtopmessage' error={error} content={message} />
            <div dangerouslySetInnerHTML={{__html: vowsHtml}} />
            <div className={vowsClass}>
              <label>
                <Control.checkbox model=".vows" />
                &nbsp;
                I agree with these vows and will commit to them in my public and professional life.
              </label>
            </div>
            <div className='verticalformbuttonrow'>
              <Button className="verticalformcontrol verticalformbottombutton" onClick={this.onClickPrev2}  floated='left'>Prev</Button>
              <Button className="verticalformcontrol verticalformbottombutton" onClick={this.onClickNext2}  floated='right'>Next</Button>
              <div style={{clear:'both' }} ></div>
            </div>
          </div>
          <div style={pane3style}>
            <Message header='Democracy Guardians Team Signup' className='verticalformtopmessage' error={error} content={message} />
            <div dangerouslySetInnerHTML={{__html: agreementHtml}} />
            <div className={agreementClass}>
              <label>
                <Control.checkbox model=".agreement" />
                &nbsp;
                I agree to the terms and conditions listed in the above
                Democracy Guardians Members Agreement
                and thereby become a member of the Democracy Guardians team.
              </label>
            </div>
            <div className='verticalformbuttonrow'>
              <Button className="verticalformcontrol verticalformbottombutton" onClick={this.onClickPrev3}  floated='left'>Prev</Button>
              <Button type="submit" className="verticalformcontrol verticalformbottombutton" floated='right'>Finish</Button>
              <div style={{clear:'both' }} ></div>
            </div>
          </div>
          <div style={pane4style}>
            <Message header='Check your email!' className='verticalformtopmessage' content={message} />
            <div className="signupVerificationEmailSent">
              <p>Congratulations! You are now a member of the Democracy Guardians team.</p>
              <p>We’ve sent a message to <strong>{email}</strong>. Open it and click Activate My Account.</p>
            </div>
            <div className='verticalformbuttonrow'>
              <Button className="verticalformcontrol verticalformbottombutton" onClick={this.resendVerificationEmail}>Resend verification email</Button>
              <div style={{clear:'both' }} ></div>
            </div>
          </div>
        </LocalForm>
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
