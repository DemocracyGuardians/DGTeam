import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render() {
    let screen = null;
    if (this.props.currentScreen === "Login") {
      screen = <Login store={this.props.store} />;
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
  return {
    store: ownProps.store,
    currentScreen
  }
}

App = connect(mapStateToProps)(App)

export default App;
