
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import { getLessonSuccess, lessonUpdateProgressSuccess, lessonRevertProgressSuccess } from '../actions/lessonActions'
import parseJsonPayload from '../util/parseJsonPayload'
import { getLocalProgress, setLocalProgress } from '../util/localProgress'
import LessonProse from '../components/Lesson/LessonProse'
import LessonTrueFalse from '../components/Lesson/LessonTrueFalse'
import LessonMultipleChoice from '../components/Lesson/LessonMultipleChoice'
import LessonConfirmVow from '../components/Lesson/LessonConfirmVow'
import './LessonWizard.css'

class LessonWizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      level: parseInt(this.props.level),
      name: this.props.name,
      lessonName: null,
      forceRerender: 0
    }
    this.getlesson = this.getlesson.bind(this);
    this.updateprogress = this.updateprogress.bind(this);
    this.onScreenComplete = this.onScreenComplete.bind(this);
    this.onScreenAdvance = this.onScreenAdvance.bind(this);
    this.onRevertProgress = this.onRevertProgress.bind(this);
    this.getLocalProgressWrapper = this.getLocalProgressWrapper.bind(this);
    this.getlesson()
  }

  getlesson() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    if (!this.state.level || !this.state.name ) {
      console.error('LessonWizard missing level:'+this.state.level+' or name:'+this.state.name)
      this.props.history.push('/systemerror')
    }
    let newLessonName = this.props.level + '/'  + this.state.name
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
              parseJsonPayload(res, action.type, function(json) {
                let lesson = json.lesson
                dispatch(getLessonSuccess(json.account, json.progress, json.tasks))
                if (!lesson.steps || !lesson.steps[0]) {
                  console.error('LessonWizard getlesson_success, but invalid lesson object')
                  this.props.history.push('/systemerror')
                } else {
                  let nSteps = lesson.steps.length
                  let localProgress = this.getLocalProgressWrapper()
                  let storeState = this.props.store.getState()
                  let maxProgress = storeState.progress
                  let tasks = storeState.tasks
                  let screenIndex = 0
                  let progressIndex = 0
                  if (this.state.level === maxProgress.level && tasks.levels[this.state.level].tasks[maxProgress.task].name === this.state.name) {
                    screenIndex = progressIndex = maxProgress.step
                  }
                  if (this.state.level === localProgress.level && tasks.levels[this.state.level].tasks[localProgress.task].name === this.state.name) {
                    screenIndex = localProgress.step
                  }
                  let task = tasks.levels[this.state.level].tasks.findIndex(task => task.name === this.state.name)
                  if (task < 0) {
                    console.error('LessonWizard getlesson_success could not find task '+this.state.name+' for level '+this.state.level)
                    this.props.history.push('/systemerror')
                    return
                  }
                  if (maxProgress.level > this.state.level || (maxProgress.level === this.state.level && maxProgress.task > task)) {
                    progressIndex = nSteps
                  }
                  localProgress.level = this.state.level
                  localProgress.task = task
                  localProgress.step = screenIndex
                  setLocalProgress(localProgress)
                  this.setState({ lessonName: newLessonName, lesson, task, progressIndex, nSteps })
                }
              }.bind(componentThis))
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

  updateprogress(progressIndex) {
    let componentThis = this
    let { level, task } = this.state
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let values = JSON.parse(JSON.stringify(storeState.progress))
    values.level = level
    values.task = task
    values.step = progressIndex
    let updateprogressApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/updateprogress'
    const apiAction = {
      [RSAA]: {
        endpoint: updateprogressApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'updateprogress_request', // ignored
          {
            type: 'updateprogress_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(lessonUpdateProgressSuccess(json.account, json.progress, json.tasks))
                let progress = json.progress
                let { level, task, nSteps } = this.state
                // In case another browser session advanced in the background
                if (progress.level > level || (progress.level === level && progress.task > task)) {
                  this.setState({ progressIndex: nSteps })
                } else if (progress.level === level && progress.task === task && progress.step > progressIndex) {
                  this.setState({ progressIndex: progress.step })
                }
              }.bind(componentThis))
            }
          },
          {
            type: 'updateprogress_failure',
            payload: (action, state, res) => {
              console.error('LessonWizard updateprogress_failure')
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
    let { progressIndex } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
      this.setState({ progressIndex })
    }
    this.updateprogress(progressIndex) // Note that screen updates while server gets its update
  }

  onScreenAdvance = () => {
    let { forceRerender, progressIndex, nSteps } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
    }
    if (screenIndex < nSteps-1) {
      screenIndex++
    }
    localProgress.step = screenIndex
    setLocalProgress(localProgress)
    forceRerender++
    this.setState({ progressIndex, forceRerender })
    this.updateprogress(progressIndex) // Note that screen updates while server gets its update
  }

  onRevertProgress() {
    let componentThis = this
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let values = JSON.parse(JSON.stringify(storeState.progress))
    let localProgress = this.getLocalProgressWrapper()
    values.level = localProgress.level
    values.task = localProgress.task
    values.step = localProgress.step
    let revertprogressApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/revertprogress'
    const apiAction = {
      [RSAA]: {
        endpoint: revertprogressApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'revertprogress_request', // ignored
          {
            type: 'revertprogress_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(lessonRevertProgressSuccess(json.account, json.progress, json.tasks))
                this.setState({ progressIndex: json.progress.step })
              }.bind(componentThis))
            }
          },
          {
            type: 'revertprogress_failure',
            payload: (action, state, res) => {
              console.error('LessonWizard revertprogress_failure')
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


  handleNavigationClick = (name, e) => {
    let { lessonName, progressIndex, nSteps} = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    let readyToFinish = progressIndex >= nSteps && screenIndex >= nSteps-1
    if (name === 'first' && screenIndex > 0) {
      screenIndex = 0
    } else if (name === 'prev' && screenIndex > 0) {
      screenIndex--
    } else if (name === 'next' && screenIndex < nSteps-1 && progressIndex >= screenIndex-1) {
      screenIndex++
    } else if (name === 'last' && screenIndex < nSteps-1 && progressIndex >= nSteps-1) {
      //FIXME readyToFinish logic
      screenIndex = nSteps - 1
    } else {
      console.error('LessonWizard handleNavigationClick unexpected case. lessonName:'+lessonName+', progressIndex='+progressIndex+', screenIndex:'+screenIndex);
      return // should not get here ever
    }
    localProgress.step = screenIndex
    setLocalProgress(localProgress)
    this.setState({ progressIndex })
    setTimeout(() => {
      let LessonScreenContent = document.querySelector('.LessonScreenContent')
      if (LessonScreenContent) {
        LessonScreenContent.scrollTop = 0
        LessonScreenContent.scrollLeft = 0
      }
    }, 50)
  }

  getLocalProgressWrapper() {
    let localProgress = getLocalProgress()
    if (!localProgress) {
      console.error('LessonWizard missing localProgress value')
      this.props.history.push('/systemerror')
    } else {
      return localProgress
    }
  }

  render() {
    let { store } = this.props
    let { lessonName, lesson, progressIndex, nSteps } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (!lesson) {
      return (<div></div>)
    }
    let type = lesson.steps[screenIndex].type
    let lessonTitle, screenTitle, screenContent, navigation
    let readyToFinish = progressIndex >= nSteps && screenIndex >= nSteps-1
    if (!lessonName) {
      lessonTitle = 'loading ... '
    } else if (!lesson || !lesson.success) {
      lessonTitle = 'lesson not found'
    } else {
      lessonTitle = (
        <h1>Lesson 1.1: {lesson.lessonTitle}</h1>
      )
      screenTitle = (
        <h2><div className="ScreenTitlePage">({screenIndex+1} of {nSteps})</div>{lesson.steps[screenIndex].title}</h2>
      )
      let firstStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let prevStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let nextStyle = { visibility: screenIndex < (nSteps-1) ? 'visible' : 'hidden'}
      let lastStyle = { visibility: screenIndex < (nSteps-1) || readyToFinish ? 'visible' : 'hidden'}
      let nextDisabled = (progressIndex <= screenIndex)
      let lastDisabled = (progressIndex < nSteps) && !readyToFinish
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
            <LessonProse content={lesson.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonTrueFalse') {
        screenContent = (
          <div>
            <LessonTrueFalse content={lesson.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonMultipleChoice') {
        screenContent = (
          <div>
            <LessonMultipleChoice content={lesson.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonConfirmVow') {
        screenContent = (
          <div>
            <LessonConfirmVow content={lesson.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
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
