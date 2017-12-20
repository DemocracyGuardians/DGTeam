
/*
TaskProfile.Js gets/puts data to server.
Child components receive initial data and provide getData functions.
*/

import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import parseJsonPayload from '../../util/parseJsonPayload'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import TaskStepBaseClass from './TaskStepBaseClass'
import TaskProfileBasic from './TaskProfileBasic'
import TaskProfileNames from './TaskProfileNames'
import TaskProfileList from './TaskProfileList'
import './TaskProfile.css'

const profileitemApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/profileitem'

// Do variable substitutions on a string
// Replacement strings can be recursively replaced, so /g isn't sufficient
let substituteVariables = function(str, variables, qualifier) {
  for (let i=0; i<1000; i++) {
    let done = true
    str = str.replace(/\(\(([^)]+)\)\)/, function(match, p1, offset, wholeString) {
      done = false
      let substitute = (variables[match] && (variables[match][qualifier] || variables[match]['all'])) || p1
      return substitute
    })
    if (done) {
      break
    }
  }
  return str
}

class TaskProfile extends TaskStepBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      //nowEditing: null
      editingInProcess: false,
      categoryData: null,
      lastSavedData: null
    }
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
    this.getCategoryData = this.getCategoryData.bind(this)
    this.onClickShowChanges = this.onClickShowChanges.bind(this)
    this.onClickSaveChanges = this.onClickSaveChanges.bind(this)
    this.onClickDiscardChanges = this.onClickDiscardChanges.bind(this)
    this.getCategoryData()
  }

  componentWillReceiveProps(nextProps) {
    let thisJson = JSON.stringify(this.props.content)
    let nextJson = JSON.stringify(nextProps.content)
    if (nextJson !== thisJson) {
      this.getCategoryData()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { editingInProcess, pendingChanges } = this.state
    if ( editingInProcess !== prevState.editingInProcess || pendingChanges !== prevState.pendingChanges) {
      let { hideShowWizardNavigation } = this.props
      hideShowWizardNavigation(!(editingInProcess || pendingChanges))
    }
  }

  static getTitle(store, content) {
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index, qualifier } = content
    let { variables } = profileCategories
    return substituteVariables(profileCategories.person[index].title, variables, qualifier)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newCategoryData } = params
    let thisJson = JSON.stringify(this.state.categoryData)
    let newJson = JSON.stringify(newCategoryData)
    let lastJson = JSON.stringify(this.state.lastSavedData)
    let pendingChanges = !(newJson === lastJson)
    if (this.state.editingInProcess !== editingInProcess ||
      this.state.pendingChanges !== pendingChanges ||
      thisJson !== newJson) {
      this.setState({ editingInProcess, pendingChanges, categoryData: newCategoryData })
    }
  }

  getCategoryData() {
    setTimeout(()  => {
      let categoryData = []
      let lastSavedData = categoryData
      this.setState({ categoryData, lastSavedData })
    }, 100)
  }

  onClickShowChanges(e) {
    e.preventDefault()
    alert('FIXME not yet implemented')
  }

  onClickSaveChanges(e) {
    e.preventDefault()
    let { categoryData } = this.state
    let newCategoryData = []
    categoryData.forEach(entry => {
      let allEmpty = true
      entry.forEach((cell, index) => {
        entry[index] = cell = cell.trim()
        if (cell.length > 0) {
          allEmpty = false
        }
      })
      if (!allEmpty) {
        newCategoryData.push(entry)
      }
    })
    this.setState({ lastSavedData: newCategoryData, categoryData: newCategoryData, pendingChanges: false })
  }

  onClickDiscardChanges(e) {
    e.preventDefault()
    let { lastSavedData } = this.state
    this.setState({ categoryData: lastSavedData, pendingChanges: false })
  }

  handleSubmit(values) {
    let localProgress = values
    let componentThis = this
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let storeStateProgress = JSON.parse(JSON.stringify(storeState.progress))
    values = Object.assign({}, storeStateProgress, localProgress)
    const apiAction = {
      [RSAA]: {
        endpoint: profileitemApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'profileitem_request', // ignored
          {
            type: 'profileitem_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                /*dispatch(resetProgressSuccess(json.account, json.progress, json.tasks))
                setLocalProgress(localProgress)
                this.props.history.push('/Tasks')*/
              }.bind(componentThis))
            }
          },
          {
            type: 'profileitem_failure',
            payload: (action, state, res) => {
              console.error('profileitem_failure')
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
    //FIXME ComponentDidUpdate?? But what about first rendering?
    setTimeout(() => {
      this.props.onStepComplete() // Tell TaskWizard ok to activate Next button
    }, 0)
    let { categoryData, /*nowEditing,*/ editingInProcess, pendingChanges } = this.state
    let { content, store } = this.props
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index, qualifier } = content
    let { variables } = profileCategories
    let { name } = profileCategories.person[index]
    // Do variable substitutions on the long description string
    // Replacement strings can be recursively replaced, so /g isn't sufficient
    let long = substituteVariables(profileCategories.person[index].long, variables, qualifier)
    // Build the list of entries
    let saveDiscardChangesTop = ''
    let saveDiscardChangesBottom = ''
    let emptyEntries = ''
    let saveDiscardChanges = (<div className="TaskProfilePendingChangesDiv">
      <span className="TaskProfileSmallSpace"></span>
      <a href="" onClick={this.onClickShowChanges} >Show Changes</a>
      <span className="TaskProfileLargeSpace"></span>
      <Button onClick={this.onClickSaveChanges} size='tiny' >Save Changes</Button>
      <span className="TaskProfileLargeSpace"></span>
      <a href="" onClick={this.onClickDiscardChanges} >Discard Changes</a>
      <span className="TaskProfileSmallSpace"></span>
    </div>)
    if (pendingChanges && !editingInProcess) {
      saveDiscardChangesBottom = saveDiscardChanges
      //FIXME need a better conditional, perhaps using height of boxes
      if (categoryData.length > 4) {
        saveDiscardChangesTop = saveDiscardChanges
      }
    }
    let category = name
    if (categoryData === null) {
      return <div></div>
    }
    let childComponent = ''
    if (category === 'basic') {
      childComponent = <TaskProfileBasic store={store} updateEditingStatus={this.updateEditingStatus} categoryData={categoryData} />
    } else if (category === 'names') {
      childComponent = <TaskProfileNames store={store} updateEditingStatus={this.updateEditingStatus} categoryData={categoryData} />
    } else if (category === 'internetId') {

    } else {
      childComponent = <TaskProfileList store={store} updateEditingStatus={this.updateEditingStatus} categoryData={categoryData} />
    }
    let anyEmpty = false
    categoryData.forEach(entry => {
      let allEmpty = true
      entry.forEach((cell, index) => {
        entry[index] = cell = cell.trim()
        if (cell.length > 0) {
          allEmpty = false
        }
      })
      if (allEmpty) {
        anyEmpty = true
      }
    })
    if (anyEmpty) {
      emptyEntries = (<div className="TaskProfileEmptyEntries">Empty entries will be removed with the next Save Changes.</div>)
    }

    return (
      <div className="TaskProfile">
        <div className="TaskProfileCategoryDescription" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(long)}} />
        {saveDiscardChangesTop}
        {childComponent}
        {emptyEntries}
        {saveDiscardChangesBottom}
      </div>
    );
  }
}

TaskProfile.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default withRouter(TaskProfile);
