
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
      lessonName: null,
      forceRerender: 0
    }
    this.getlesson = this.getlesson.bind(this);
    this.updateprogress = this.updateprogress.bind(this);
    this.onScreenComplete = this.onScreenComplete.bind(this);
    this.onScreenAdvance = this.onScreenAdvance.bind(this);
    this.onRevertProgress = this.onRevertProgress.bind(this);
    this.getlesson()
  }

  getlesson() {
    let componentThis = this
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
              parseJsonPayload(res, action.type, function(json) {
                let lesson = json.lesson
                dispatch(getLessonSuccess(json.account, json.progress, json.tasks))
                if (!lesson.screens || !lesson.screens[0]) {
                  console.error('LessonWizard getlesson_success, but invalid lesson object')
                  this.props.history.push('/systemerror')
                } else {
                  let nScreens = lesson.screens.length
                  let localProgress = getLocalProgress()
                  let { level, name } = this.props
                  level = level-0 // convert to number
                  let storeState = this.props.store.getState()
                  let maxProgress = storeState.progress
                  let tasks = storeState.tasks
                  let screenIndex = 0
                  let progressIndex = 0
                  if (level === maxProgress.level && tasks.levels[level].tasks[maxProgress.task].name === name) {
                    screenIndex = progressIndex = maxProgress.subtask
                  }
                  if (level === localProgress.level && tasks.levels[level].tasks[localProgress.task].name === name) {
                    screenIndex = localProgress.subtask
                  }
                  let task = tasks.levels[level].tasks.findIndex(task => task.name === name)
                  if (task < 0) {
                    console.error('LessonWizard getlesson_success could not find task '+name+' for level '+level)
                    this.props.history.push('/systemerror')
                    return
                  }
                  if (maxProgress.level > level || (maxProgress.level === level && maxProgress.task > task)) {
                    progressIndex = nScreens
                  }
                  localProgress.level = level
                  localProgress.task = task
                  localProgress.subtask = screenIndex
                  setLocalProgress(localProgress)
                  this.setState({ lessonName: newLessonName, lesson, level, task, progressIndex, nScreens })
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
    values.subtask = progressIndex
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
                let { level, task, nScreens } = this.state
                // In case another browser session advanced in the background
                if (progress.level > level || (progress.level === level && progress.task > task)) {
                  this.setState({ progressIndex: nScreens })
                } else if (progress.level === level && progress.task === task && progress.subtask > progressIndex) {
                  this.setState({ progressIndex: progress.subtask })
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
    let localProgress = getLocalProgress()
    let screenIndex = localProgress.subtask
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
      this.setState({ progressIndex })
    }
    this.updateprogress(progressIndex) // Note that screen updates while server gets its update
  }

  onScreenAdvance = () => {
    let { forceRerender, progressIndex, nScreens } = this.state
    let localProgress = getLocalProgress()
    let screenIndex = localProgress.subtask
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
    }
    if (screenIndex < nScreens-1) {
      screenIndex++
    }
    localProgress.subtask = screenIndex
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
    let localProgress = getLocalProgress()
    values.level = localProgress.level
    values.task = localProgress.task
    values.subtask = localProgress.subtask
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
                this.setState({ progressIndex: json.progress.subtask })
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
    let { lessonName, progressIndex, nScreens} = this.state
    let localProgress = getLocalProgress()
    let screenIndex = localProgress.subtask
    let readyToFinish = progressIndex >= nScreens && screenIndex >= nScreens-1
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
    localProgress.subtask = screenIndex
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

  render() {
    let { store } = this.props
    let { lessonName, lesson, progressIndex, nScreens } = this.state
    let localProgress = getLocalProgress()
    let screenIndex = localProgress.subtask
    if (!lesson) {
      return (<div></div>)
    }
    let type = lesson.screens[screenIndex].type
    let lessonTitle, screenTitle, screenContent, navigation
    let readyToFinish = progressIndex >= nScreens && screenIndex >= nScreens-1
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
      let nextDisabled = (progressIndex <= screenIndex)
      let lastDisabled = (progressIndex < nScreens) && !readyToFinish
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
            <LessonProse content={lesson.screens[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonTrueFalse') {
        screenContent = (
          <div>
            <LessonTrueFalse content={lesson.screens[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonMultipleChoice') {
        screenContent = (
          <div>
            <LessonMultipleChoice content={lesson.screens[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="LessonNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'LessonConfirmVow') {
        screenContent = (
          <div>
            <LessonConfirmVow content={lesson.screens[screenIndex].content} store={store}
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
