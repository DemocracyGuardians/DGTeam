
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import parseJsonPayload from '../util/parseJsonPayload'
import LessonProse from '../components/Lesson/LessonProse'
import LessonTrueFalse from '../components/Lesson/LessonTrueFalse'
import LessonMultipleChoice from '../components/Lesson/LessonMultipleChoice'
import LessonConfirmVow from '../components/Lesson/LessonConfirmVow'
import './LessonWizard.css'

class LessonWizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lessonName: null
    }
    this.getlesson = this.getlesson.bind(this);
    this.onScreenComplete = this.onScreenComplete.bind(this);
    this.onScreenAdvance = this.onScreenAdvance.bind(this);
    this.getlesson()
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
                let lesson = json
                if (!lesson.screens || !lesson.screens[0]) {
                  console.error('LessonWizard getlesson_success, but invalid lesson object')
                  this.props.history.push('/systemerror')
                } else {
                  let progressIndex = lesson.screens[0].type === 'Prose' ? 0 : -1
                  this.setState({ lessonName: newLessonName, lesson, screenIndex: 0, progressIndex, nScreens: lesson.screens.length })
                }
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

  onScreenComplete = () => {
    let { screenIndex, progressIndex} = this.state
    if (progressIndex < screenIndex) {
      this.setState({ progressIndex: screenIndex })
    }
  }

  onScreenAdvance = () => {
    let { screenIndex, progressIndex, nScreens } = this.state
    if (progressIndex < screenIndex) {
      progressIndex = screenIndex
    }
    if (screenIndex < nScreens-1) {
      screenIndex++
    }
    this.setState({ progressIndex, screenIndex })
  }

  handleNavigationClick = (name, e) => {
    let { lesson, lessonName, screenIndex, progressIndex, nScreens} = this.state
    let readyToFinish = progressIndex >= nScreens-1 && screenIndex >= nScreens-1
    if (name === 'first' && screenIndex > 0) {
      screenIndex = 0
    } else if (name === 'prev' && screenIndex > 0) {
      screenIndex--
    } else if (name === 'next' && screenIndex < nScreens-1 && progressIndex >= screenIndex-1) {
      screenIndex++
    } else if (name === 'last' && screenIndex < nScreens-1 && progressIndex >= nScreens-1) {
      //FIXME readyToFinish logic
      screenIndex = nScreens - 1
    } else {
      console.error('LessonWizard handleNavigationClick unexpected case. lessonName:'+lessonName+', progressIndex='+progressIndex+', screenIndex:'+screenIndex);
      return // should not get here ever
    }
    if (progressIndex < screenIndex && lesson.screens[screenIndex].type === 'Prose') {
      progressIndex = screenIndex
    }
    this.setState({ screenIndex, progressIndex })
    setTimeout(() => {
      let LessonScreenContent = document.querySelector('.LessonScreenContent')
      if (LessonScreenContent) {
        LessonScreenContent.scrollTop = 0
        LessonScreenContent.scrollLeft = 0
      }
    }, 50)
  }

  render() {
    let { store } = this.props
    let { lessonName, lesson, screenIndex, progressIndex, nScreens } = this.state
    if (!lesson) {
      return (<div></div>)
    }
    let type = lesson.screens[screenIndex].type
    let lessonTitle, screenTitle, screenContent, navigation
    let readyToFinish = progressIndex >= nScreens-1 && screenIndex >= nScreens-1
    if (!lessonName) {
      lessonTitle = 'loading ... '
    } else if (!lesson || !lesson.success) {
      lessonTitle = 'lesson not found'
    } else {
      lessonTitle = (
        <h1>Lesson 1.1: {lesson.lessonTitle}</h1>
      )
      screenTitle = (
        <h2><div className="ScreenTitlePage">({screenIndex+1} of {nScreens})</div>{lesson.screens[screenIndex].title}</h2>
      )
      let firstStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let prevStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let nextStyle = { visibility: screenIndex < (nScreens-1) ? 'visible' : 'hidden'}
      let lastStyle = { visibility: screenIndex < (nScreens-1) || readyToFinish ? 'visible' : 'hidden'}
      let nextDisabled = (progressIndex < screenIndex)
      let lastDisabled = (progressIndex < nScreens-1) && !readyToFinish
      let lastText = readyToFinish ? 'Finish' : 'End'
      navigation = (
        <div className="LessonNavigationButtons">
          <span className="LessonNavigationButton first" style={firstStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'first')} >Start</Button>
          </span>
          <span className="LessonNavigationButton prev" style={prevStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'prev')} >Prev</Button>
          </span>
          <span className="LessonNavigationButton next" style={nextStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'next')} disabled={nextDisabled} >Next</Button>
          </span>
          <span className="LessonNavigationButton last" style={lastStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'last')} disabled={lastDisabled} >{lastText}</Button>
          </span>
        </div>
      )
      if (type === 'LessonProse') {
        screenContent = (
          <div>
            <LessonProse content={lesson.screens[screenIndex].content}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} store={store} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonTrueFalse') {
        screenContent = (
          <div>
            <LessonTrueFalse content={lesson.screens[screenIndex].content}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} store={store} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonMultipleChoice') {
        screenContent = (
          <div>
            <LessonMultipleChoice content={lesson.screens[screenIndex].content}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} store={store} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonConfirmVow') {
        screenContent = (
          <div>
            <LessonConfirmVow content={lesson.screens[screenIndex].content}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} store={store} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      }
    }
    return (
      <div className="LessonWizard">
        <div className="LessonTitle">{lessonTitle}</div>
        <div className="LessonScreenTitle">{screenTitle}</div>
        <div className="LessonScreenContent">{screenContent}</div>
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
