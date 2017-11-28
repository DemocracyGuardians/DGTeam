
import React from 'react';
import PropTypes from 'prop-types'

class TaskStepBaseClass extends React.Component {
  render() {
    return (<span></span>)
  }
}

TaskStepBaseClass.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}


export default TaskStepBaseClass;
