
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import LessonScreenBaseClass from './LessonScreenBaseClass'
import './LessonProse.css'

class LessonProse extends LessonScreenBaseClass {

  render() {
    let { content } = this.props
    setTimeout(() =>{
      this.props.onScreenComplete() // Tell LessonWizard ok to activate Next button
    }, 0)
    return (
      <div className="LessonProse" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />
    );
  }
}

LessonProse.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onScreenComplete: PropTypes.func.isRequired,
  onScreenAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired
}

export default withRouter(LessonProse);
