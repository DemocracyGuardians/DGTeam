
import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react'

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
            <Input name="email" placeholder="Email" />
          </div>
          <div className="usermgmtfieldrow">
            <Input type="password" name="password" placeholder="Password" />
          </div>
          <div className="usermgmtbuttonrow">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
