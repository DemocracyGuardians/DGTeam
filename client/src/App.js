import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'
import ResendAccountVerification from './components/ResendAccountVerification'
import SystemError from './components/SystemError'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render() {
    const LoginComp = (() => (<Login store={this.props.store} />))
    const SignupComp = (() => (<Signup store={this.props.store} />))
    const WorkbenchComp = (() => (<Workbench store={this.props.store} />))
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={LoginComp} />
            <Route path='/signup' component={SignupComp} />
            <Route path='/workbench' component={WorkbenchComp} />
            <Route path='/resendverification' component={ResendAccountVerification} />
            <Route path='/systemerror' component={SystemError} />
            <Redirect path='*' to="/login" />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

App = connect(mapStateToProps)(App)

export default App;
