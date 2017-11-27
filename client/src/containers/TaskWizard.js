
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import { getTaskSuccess, taskUpdateProgressSuccess, taskRevertProgressSuccess } from '../actions/taskActions'
import parseJsonPayload from '../util/parseJsonPayload'
import { getLocalProgress, setLocalProgress } from '../util/localProgress'
import TaskProse from '../components/Task/TaskProse'
import TaskTrueFalse from '../components/Task/TaskTrueFalse'
import TaskMultipleChoice from '../components/Task/TaskMultipleChoice'
import TaskConfirmVow from '../components/Task/TaskConfirmVow'
import './TaskWizard.css'

class TaskWizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      level: parseInt(this.props.level, 10),
      name: this.props.name,
      taskName: null,
      forceRerender: 0
    }
    this.gettask = this.gettask.bind(this);
    this.updateprogress = this.updateprogress.bind(this);
    this.onScreenComplete = this.onScreenComplete.bind(this);
    this.onScreenAdvance = this.onScreenAdvance.bind(this);
    this.onRevertProgress = this.onRevertProgress.bind(this);
    this.getLocalProgressWrapper = this.getLocalProgressWrapper.bind(this);
    this.gettask()
  }

  gettask() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    if (!this.state.level || !this.state.name ) {
      console.error('TaskWizard missing level:'+this.state.level+' or name:'+this.state.name)
      this.props.history.push('/systemerror')
    }
    let newTaskName = this.props.level + '/'  + this.state.name
    if (newTaskName === this.state.taskName) {
      return
    }
    let gettaskApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/gettask/' + newTaskName
    const apiAction = {
      [RSAA]: {
        endpoint: gettaskApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'gettask_request', // ignored
          {
            type: 'gettask_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                let task = json.task
                dispatch(getTaskSuccess(json.account, json.progress, json.tasks))
                if (!task.steps || !task.steps[0]) {
                  console.error('TaskWizard gettask_success, but invalid task object')
                  this.props.history.push('/systemerror')
                } else {
                  let nSteps = task.steps.length
                  let localProgress = this.getLocalProgressWrapper()
                  let storeState = this.props.store.getState()
                  let maxProgress = storeState.progress
                  let tasks = storeState.tasks
                  let screenIndex = 0
                  let progressIndex = 0
                  if (this.state.level === maxProgress.level && tasks.levels[this.state.level].tasks[maxProgress.tasknum].name === this.state.name) {
                    screenIndex = progressIndex = maxProgress.step
                  }
                  if (this.state.level === localProgress.level && tasks.levels[this.state.level].tasks[localProgress.tasknum].name === this.state.name) {
                    screenIndex = localProgress.step
                  }
                  let tasknum = tasks.levels[this.state.level].tasks.findIndex(tasknum => tasknum.name === this.state.name)
                  if (tasknum < 0) {
                    console.error('TaskWizard gettask_success could not find tasknum '+this.state.name+' for level '+this.state.level)
                    this.props.history.push('/systemerror')
                    return
                  }
                  if (maxProgress.level > this.state.level || (maxProgress.level === this.state.level && maxProgress.tasknum > tasknum)) {
                    progressIndex = nSteps
                  }
                  localProgress.level = this.state.level
                  localProgress.tasknum = tasknum
                  localProgress.step = screenIndex
                  setLocalProgress(localProgress)
                  this.setState({ taskName: newTaskName, task, tasknum, progressIndex, nSteps })
                }
              }.bind(componentThis))
            }
          },
          {
            type: 'gettask_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard gettask_failure')
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
    let { level, tasknum } = this.state
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let values = JSON.parse(JSON.stringify(storeState.progress))
    values.level = level
    values.tasknum = tasknum
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
                dispatch(taskUpdateProgressSuccess(json.account, json.progress, json.tasks))
                let progress = json.progress
                let { level, tasknum, nSteps } = this.state
                // In case another browser session advanced in the background
                if (progress.level > level || (progress.level === level && progress.tasknum > tasknum)) {
                  this.setState({ progressIndex: nSteps })
                } else if (progress.level === level && progress.tasknum === tasknum && progress.step > progressIndex) {
                  this.setState({ progressIndex: progress.step })
                }
              }.bind(componentThis))
            }
          },
          {
            type: 'updateprogress_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard updateprogress_failure')
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
    values.tasknum = localProgress.tasknum
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
                dispatch(taskRevertProgressSuccess(json.account, json.progress, json.tasks))
                this.setState({ progressIndex: json.progress.step })
              }.bind(componentThis))
            }
          },
          {
            type: 'revertprogress_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard revertprogress_failure')
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
    let { taskName, progressIndex, nSteps} = this.state
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
      console.error('TaskWizard handleNavigationClick unexpected case. taskName:'+taskName+', progressIndex='+progressIndex+', screenIndex:'+screenIndex);
      return // should not get here ever
    }
    localProgress.step = screenIndex
    setLocalProgress(localProgress)
    this.setState({ progressIndex })
    setTimeout(() => {
      let TaskScreenContent = document.querySelector('.TaskScreenContent')
      if (TaskScreenContent) {
        TaskScreenContent.scrollTop = 0
        TaskScreenContent.scrollLeft = 0
      }
    }, 50)
  }

  getLocalProgressWrapper() {
    let localProgress = getLocalProgress()
    if (!localProgress) {
      console.error('TaskWizard missing localProgress value')
      this.props.history.push('/systemerror')
    } else {
      return localProgress
    }
  }

  render() {
    let { store } = this.props
    let { taskName, task, level, progressIndex, nSteps, tasknum } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (!task) {
      return (<div></div>)
    }
    let type = task.steps[screenIndex].type
    let taskTitle, screenTitle, screenContent, navigation
    let readyToFinish = progressIndex >= nSteps && screenIndex >= nSteps-1
    if (!taskName) {
      taskTitle = 'loading ... '
    } else if (!task || !task.success) {
      taskTitle = 'task not found'
    } else {
      taskTitle = (
        <h1>Task {level}.{tasknum+1}: {task.title}</h1>
      )
      screenTitle = (
        <h2><div className="ScreenTitlePage">({screenIndex+1} of {nSteps})</div>{task.steps[screenIndex].title}</h2>
      )
      let firstStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let prevStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
      let nextStyle = { visibility: screenIndex < (nSteps-1) ? 'visible' : 'hidden'}
      let lastStyle = { visibility: screenIndex < (nSteps-1) || readyToFinish ? 'visible' : 'hidden'}
      let nextDisabled = (progressIndex <= screenIndex)
      let lastDisabled = (progressIndex < nSteps) && !readyToFinish
      let lastText = readyToFinish ? 'Finish' : 'End'
      navigation = (
        <div className="TaskNavigationButtons">
          <span className="TaskNavigationButton first" style={firstStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'first')} >Start</Button>
          </span>
          <span className="TaskNavigationButton prev" style={prevStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'prev')} >Prev</Button>
          </span>
          <span className="TaskNavigationButton next" style={nextStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'next')} disabled={nextDisabled} >Next</Button>
          </span>
          <span className="TaskNavigationButton last" style={lastStyle} >
            <Button onClick={this.handleNavigationClick.bind(this, 'last')} disabled={lastDisabled} >{lastText}</Button>
          </span>
        </div>
      )
      if (type === 'TaskProse') {
        screenContent = (
          <div>
            <TaskProse content={task.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskTrueFalse') {
        screenContent = (
          <div>
            <TaskTrueFalse content={task.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskMultipleChoice') {
        screenContent = (
          <div>
            <TaskMultipleChoice content={task.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskConfirmVow') {
        screenContent = (
          <div>
            <TaskConfirmVow content={task.steps[screenIndex].content} store={store}
              onScreenComplete={this.onScreenComplete} onScreenAdvance={this.onScreenAdvance} onRevertProgress={this.onRevertProgress} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      }
    }
    return (
      <div className="TaskWizard">
        <div className="TaskTitle">{taskTitle}</div>
        <div className="TaskScreenTitle">{screenTitle}</div>
        <div className="TaskScreenContent">{screenContent}</div>
      </div>
    );
  }
}

TaskWizard.propTypes = {
  store: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default withRouter(TaskWizard);
