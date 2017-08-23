import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { RSAA } from 'redux-api-middleware';
import { connect } from 'react-redux'
import { loginFetch } from './actions/loginActions'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from './actions/loginActions'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionReducer: {
        currentScreen: 'show_login',
        isFetching: false,
        message: ''
      }
    }
    this.onSubmitLogin = this.onSubmitLogin.bind(this)
  }

  onSubmitLogin(e) {
    e.preventDefault()
    let f = e.target
    //validate form
    //if (!input.value.trim()) {
      //return
    //}
    var payload = {
      email: f.email.value,
      password: f.password.value
    }
    const apiAction = {
      [RSAA]: {
        endpoint: "http://localhost:3001/api/login",
        method: 'POST',
        types: [LOGIN_REQUEST,  LOGIN_SUCCESS, LOGIN_FAILURE],
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    this.props.store.dispatch(apiAction)
  }

  render() {
    const { currentScreen } = this.props
    let screen = null;
    if (this.props.currentScreen === "show_login") {
      screen = <Login onSubmitLogin={this.onSubmitLogin} />;
    } else if (this.props.currentScreen === "show_registration") {
      screen = <Signup />;
    } else if (this.props.currentScreen === "show_dashboard") {
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
  const { currentScreen, isFetching, message } = state.sessionReducer || {}
  return {
    store: ownProps.store,
    currentScreen: currentScreen,
    isFetching: isFetching,
    message: message
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)


export default App;
