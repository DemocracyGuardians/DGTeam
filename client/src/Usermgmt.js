import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';

class Usermgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      screenToShow: 'Login'
    }
  }

  render() {
    let screen = null;
    if (this.state.screenToShow === "Login") {
      screen = <Login parentComponent={this}/>;
    } else if (this.state.screenToShow === "Register") {
      screen = <Register parentComponent={this} />;
    } else {
      screen = <div>Error in value of this.state.screenToShow: {this.state.screenToShow}</div>;
    }
    return (
      <div className="usermgmt">
        {screen}
        <div>{this.state.message}</div>
      </div>
    );
  }
}

export default Usermgmt;
