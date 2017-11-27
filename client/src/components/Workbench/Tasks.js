
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import { getTasksSuccess } from '../../actions/tasksActions'
import parseJsonPayload from '../../util/parseJsonPayload'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { Checkbox, Feed, Icon, Input, Menu } from 'semantic-ui-react'
import './Tasks.css'

let notifications = [
  {
    id: '1',
    when: '3 hours ago',
    subject: 'Welcome!',
    from: '(automatically generated)',
    content: `
<h3>Welcome to the Democracy Guardians team!</h3>
<p>With the team application, you start out at level 1.
  As you learn and develop skills, you advance to higher levels. </p>
<p>To complete Level 1 and advance to level 2, you must complete the following three training modules:</p>
<ul class="AppTaskList">
  <li><a href="/Lesson/1/Trustworthiness" class="AppTaskPressmeHighlight">Introducing Trustworthiness - Press here to start</a></li>
  <li>Confirming Your Vows</li>
  <li>Filling Out Your Profile</li>
</ul>
    `
  }
]

class Tasks extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: null
    }
    this.gettasks = this.gettasks.bind(this);
    this.gettasks()
  }

  gettasks() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    let gettasksApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/gettasks'
    const apiAction = {
      [RSAA]: {
        endpoint: gettasksApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'gettasks_request', // ignored
          {
            type: 'gettasks_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(getTasksSuccess(json.account, json.progress, json.tasks))
                this.setState({ tasks: json.tasks, progress: json.progress })
              }.bind(componentThis))
            }
          },
          {
            type: 'gettasks_failure',
            payload: (action, state, res) => {
              console.error('Tasks gettasks_failure')
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
    if (!this.state.tasks) {
      return (<div></div>)
    }
    let { tasks, progress } = this.state
    let { level, task, step } = progress
    let count = 0
    let r = []
    let levelTasks = tasks.levels[level].tasks
    levelTasks.map((item, index) => {
      let type = <span className="TaskItemType">{item.type}</span>
      let num = <span className="TaskItemNum">{level}.{index+1}</span>
      let name = <span className="TaskItemName">{item.name}</span>
      let href = "/" + item.type + "/" + level + "/" + item.name
      if (task === index) {
        let thisIs = <span className="TasksThisIsCurrent">Your current task</span>
        r.push( <li key={(count++).toString()} className="TasksItemCurrent">
          <a href={href}>{type} {num}: {name} {thisIs}</a>
        </li> )
      } else {
        r.push( <li key={(count++).toString()} className="TasksItemNonCurrent">{type} {num}: {name}</li> )
      }
      return null
    })
    let workVerb = step === 0 ? 'begin' : 'continue'
    return (
      <div className="Tasks">
        <p>You are currently at <span className="TasksCurrentLevel">level {level}</span>.</p>
        <p>Once you complete the following tasks,
          you will advance to <span className="TasksNextLevel">level {level+1}</span>:
        </p>
        <ul>
          {r}
        </ul>
        <p>Press the highlighted item to {workVerb} on your current task. </p>
      </div>
    )
  }
}

Tasks.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Tasks);
