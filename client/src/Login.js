import React from 'react';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleClick(event){
    var apiBaseUrl = "http://localhost:3001/api/";
    console.log("values", this.state.email, this.state.password);
    var payload = {
      email: this.state.email,
      password: this.state.password
    }
    var that = this;  //FIXME
    var fetchParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(payload)
    };
    fetch(apiBaseUrl+'/login', fetchParams).then(function(response) {
      console.log(response);
      if (response.status === 200) {
        console.log("login success");
        that.props.parentComponent.setState({screenToShow: "Register", message: "Logged in" }); //FIXME
      } else if (response.status === 401) {
        console.log("incorrect password");
      } else if (response.status === 400) {
        console.log("email not registered");
      } else {
        console.log("unknown login error. Status=" + response.status);
      }
    })
    .catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    })
  }

  render() {
    return (
      <div className="usermgmt usermgmtlogin">
        <div className="usermgmttitle">Login</div>
        <div className="usermgmtfieldrow">
          <input type="text" name="email" placeholder="Email" onChange={this.handleChange} />
        </div>
        <div className="usermgmtfieldrow">
          <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
        </div>
        <div className="usermgmtbuttonrow">
          <button onClick={(event) => this.handleClick(event)}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login;
