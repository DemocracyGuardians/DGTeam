
import React from 'react';

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //password: ''
    }
    //this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="workbench">
        User workbench
      </div>
    );
  }
}

export default Dashboard;
