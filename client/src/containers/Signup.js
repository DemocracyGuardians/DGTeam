import React from 'react';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
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
    console.log("values", this.state.firstName, this.state.lastName, this.state.email, this.state.password);
    var payload = {
      "firstName": this.state.firstName,
      "lastName":this.state.lastName,
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
        console.log("Signup success");
        that.props.parentComponent.setState({screenToShow: "Login", message: "Signup successful" }); //FIXME
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
      <div className="usermgmt usermgmtsignup">
        <div className="usermgmttitle">Signup</div>
        <div className="usermgmtfieldrow">
          <input type="text" name="firstName" placeholder="First name" onChange={this.handleChange} />
        </div>
        <div className="usermgmtfieldrow">
          <input type="text" name="lastName" placeholder="Last name" onChange={this.handleChange} />
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
