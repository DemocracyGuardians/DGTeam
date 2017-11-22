
import React from 'react';
import PropTypes from 'prop-types'

class LessonScreenBaseClass extends React.Component {
  render() {
    return (<span></span>)
  }
}

LessonScreenBaseClass.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onScreenComplete: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}


export default LessonScreenBaseClass;
