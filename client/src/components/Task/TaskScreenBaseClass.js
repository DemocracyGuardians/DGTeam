
import React from 'react';
import PropTypes from 'prop-types'

class TaskScreenBaseClass extends React.Component {
  render() {
    return (<span></span>)
  }
}

TaskScreenBaseClass.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onScreenComplete: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}


export default TaskScreenBaseClass;
