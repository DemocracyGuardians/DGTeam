import React from 'react';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
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
    console.log("values", this.state.first_name, this.state.last_name, this.state.email, this.state.password);
    var payload = {
      "first_name": this.state.first_name,
      "last_name":this.state.last_name,
      "email":this.state.email,
      "password":this.state.password
    }
    var that = this;  //FIXME
    var fetchParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(payload)
    };
    fetch(apiBaseUrl+'/register', fetchParams).then(function(response) {
      console.log(response);
      if (response.status === 200) {
        console.log("registration success");
        that.props.parentComponent.setState({screenToShow: "Login", message: "Registered" }); //FIXME
      } else {
        console.log("registration failure");
      }
    })
   .catch(function (error) {
     console.log('There has been a problem with your fetch operation: ' + error.message);
   })
 }

  render() {
    return (
      <div className="usermgmt usermgmtregister">
        <div className="usermgmttitle">Register</div>
        <div className="usermgmtfieldrow">
          <input type="text" name="first_name" placeholder="First name" onChange={this.handleChange} />
        </div>
        <div className="usermgmtfieldrow">
          <input type="text" name="last_name" placeholder="Last name" onChange={this.handleChange} />
        </div>
        <div className="usermgmtfieldrow">
          <input type="text" name="email" placeholder="Email" onChange={this.handleChange} />
        </div>
        <div className="usermgmtfieldrow">
          <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
        </div>
        <div className="usermgmtbuttonrow">
          <button onClick={(event) => this.handleClick(event)}>Register</button>
        </div>
      </div>
    );
  }
}

export default Register;
