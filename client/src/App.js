import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'

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
            <Redirect path='*' to="/login" />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currentScreen } = state.appstate || {}
  return {
    store: ownProps.store,
    currentScreen
  }
}

App = connect(mapStateToProps)(App)

export default App;
