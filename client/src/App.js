import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux'
import { loginFetch } from './actions/loginActions'
import './App.css';
import Usermgmt from './Usermgmt'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentScreen: 'show_login',
      isFetching: false,
      message: ''
    }
    this.onSubmitLogin = this.onSubmitLogin.bind(this)
    window.setInterval(() => {console.log('App state='+JSON.stringify(this.state));}, 10000);
  }

  onSubmitLogin(e) {
    e.preventDefault()
    let f = e.target
    //validate form
    //if (!input.value.trim()) {
      //return
    //}
    this.props.store.dispatch(loginFetch(f.email.value, f.password.value))
  }

  render() {
    const { currentScreen } = this.props
    return (
      <div className="App">
        <Usermgmt currentScreen={currentScreen} onSubmitLogin={this.onSubmitLogin} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currentScreen, isFetching, message } = state
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
