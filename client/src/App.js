import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { RSAA } from 'redux-api-middleware';
import { connect } from 'react-redux'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './actions/loginActions'
import { appstateLoginSuccess } from './actions/appstateActions'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginReducer: {
        currentScreen: 'Login',
        isFetching: false,
        message: '',
        error: false
      }
    }
    this.onSubmitLogin = this.onSubmitLogin.bind(this)
  }

  onSubmitLogin(payload) {
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: "http://localhost:3001/api/login",
        method: 'POST',
        types: [
          LOGIN_REQUEST,
          {
            type: LOGIN_SUCCESS,
            payload: (action, state) => {
              dispatch(appstateLoginSuccess())
              return undefined
            }
          },
          LOGIN_FAILURE
        ],
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  render() {
    let { message, error } = this.props
    let screen = null;
    if (this.props.currentScreen === "Login") {
      screen = <Login onSubmitLogin={this.onSubmitLogin} message={message} error={error} />;
    } else if (this.props.currentScreen === "Signup") {
      screen = <Signup />;
    } else if (this.props.currentScreen === "Workbench") {
      screen = <Workbench />;
    } else {
      screen = <div>Error in value of this.props.currentScreen: {this.props.currentScreen}</div>;
    }
    return (
      <div className="App">
        {screen}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currentScreen } = state.appstate || {}
  const { message, error } = state.login || {}
  return {
    store: ownProps.store,
    currentScreen,
    message,
    error
  }
}

App = connect(mapStateToProps)(App)

export default App;
