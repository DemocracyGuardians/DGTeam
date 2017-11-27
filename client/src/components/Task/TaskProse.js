
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import TaskScreenBaseClass from './TaskScreenBaseClass'
import './TaskProse.css'

class TaskProse extends TaskScreenBaseClass {

  render() {
    let { content } = this.props
    setTimeout(() =>{
      this.props.onScreenComplete() // Tell TaskWizard ok to activate Next button
    }, 0)
    return (
      <div className="TaskProse" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />
    );
  }
}

TaskProse.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onScreenComplete: PropTypes.func.isRequired,
  onScreenAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}

export default withRouter(TaskProse);
