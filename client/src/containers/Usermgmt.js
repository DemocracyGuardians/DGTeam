import React, { Component } from 'react';
import Login from './Login';
import Register from './Signup';
import Dashboard from './Workbench';

class Usermgmt extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let screen = null;
    if (this.props.currentScreen === "show_login") {
      screen = <Login onSubmitLogin={this.props.onSubmitLogin} />;
    } else if (this.props.currentScreen === "show_registration") {
      screen = <Register />;
    } else if (this.props.currentScreen === "show_dashboard") {
      screen = <Dashboard />;
    } else {
      screen = <div>Error in value of this.props.currentScreen: {this.props.currentScreen}</div>;
    }
    return (
      <div className="usermgmt">
        {screen}
      </div>
    );
  }
}

export default Usermgmt;
