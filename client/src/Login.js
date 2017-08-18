
import React, { Component } from 'react';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <form className="usermgmt usermgmtlogin" onSubmit={this.props.onSubmitLogin} >
          <div className="usermgmttitle">Login</div>
          <div className="usermgmtfieldrow">
            <input type="text" name="email" placeholder="Email" />
          </div>
          <div className="usermgmtfieldrow">
            <input type="password" name="password" placeholder="Password" />
          </div>
          <div className="usermgmtbuttonrow">
            <button type="submit">Login"</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
