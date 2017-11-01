
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import parseJsonPayload from '../util/parseJsonPayload'
import './LessonWizard.css'

class LessonWizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lessonName: null
    }
    this.getlesson = this.getlesson.bind(this);
  }

  getlesson() {
    let values = {}
    let { dispatch } = this.props.store
    let { level, name } = this.props
    if (!level || !name ) {
      console.error('LessonWizard missing level:'+level+' or name:'+name)
      this.props.history.push('/systemerror')
    }
    let newLessonName = level + '/'  + name
    if (newLessonName === this.state.lessonName) {
      return
    }
    let getlessonApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/getlesson/' + newLessonName
    const apiAction = {
      [RSAA]: {
        endpoint: getlessonApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'getlesson_request', // ignored
          {
            type: 'getlesson_success',
            payload: (action, state, res) => {
              parseJsonPayload.bind(this)(res, action.type, json => {
                this.setState({ lessonName: newLessonName, lesson: json })
              })
            }
          },
          {
            type: 'getlesson_failure',
            payload: (action, state, res) => {
              console.error('LessonWizard getlesson_failure')
              this.props.history.push('/systemerror')
            }
          }
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  render() {
    this.getlesson()
    let { store } = this.props
    let { lessonName, lesson } = this.state
    let title, screen, navigation
    if (!lessonName) {
      title = 'loading ... '
    } else if (!lesson || !lesson.success) {
      title = 'lesson not found'
    } else {
      title = (
        <h1>Lesson 1.1: {lesson.title}</h1>
      )
      screen = (
        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(lesson.screens[0].content)}} />
      )
    }
    return (
      <div className="LessonWizard">
        <div className="LessonTitle">{title}</div>
        <div className="LessonScreen">
          {screen}
        </div>
        <div className="LessonNavigation">{navigation}</div>
      </div>
    );
  }
}

LessonWizard.propTypes = {
  store: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default withRouter(LessonWizard);
