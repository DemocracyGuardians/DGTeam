
/*
TaskProfile.Js gets/puts data to server.
Child components receive initial data and provide getData functions.
LastSavedData belongs in TaskProfile.Js but descendants might keep their own too
onInput goes in child components within the Entry component, receives prop onDataChanged(newValue, row, col)
entries then passes new entryData back up
textarea resize utility function used by child components that use textarea
data is array of arrays
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
import TaskProfileList from './TaskProfileList'
import './TaskProfile.css'

const profileitemApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/profileitem'

// Do variable substitutions on a string
// Replacement strings can be recursively replaced, so /g isn't sufficient
let substituteVariables = function(str, variables, qualifier) {
  for (let i=0; i<1000; i++) {
    let done = true
    str = str.replace(/\(\(([^\)]+)\)\)/, function(match, p1, offset, wholeString) {
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
    /*
    this.updatePendingChanges = this.updatePendingChanges.bind(this)
    this.updateHideShowWizardNavigation = this.updateHideShowWizardNavigation.bind(this)
    this.setFocusNowEditing = this.setFocusNowEditing.bind(this)
    this.onClickAddEntry = this.onClickAddEntry.bind(this)
    this.onClickEditEntry = this.onClickEditEntry.bind(this)
    this.onClickSaveEntry = this.onClickSaveEntry.bind(this)
    this.onClickRevertEntry = this.onClickRevertEntry.bind(this)
    this.onClickMoveUp = this.onClickMoveUp.bind(this)
    this.onClickMoveDown = this.onClickMoveDown.bind(this)
    this.onClickDeleteEntry = this.onClickDeleteEntry.bind(this)
    this.handleInput = this.handleInput.bind(this)
    */
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
      let categoryData = [['123'],['456']]
      let lastSavedData = categoryData
      this.setState({ categoryData, lastSavedData })
    }, 100)
  }

  /*

  updatePendingChanges() {
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


  updateHideShowWizardNavigation() {
    setTimeout(() => {
      let { nowEditing, pendingChanges } = this.state
      let { hideShowWizardNavigation } = this.props
      hideShowWizardNavigation(!(typeof nowEditing === 'number' || pendingChanges))
    }, 0)
  }
*/
  /*

  setFocusNowEditing() {
    // FIXME use promises. Multiple setTimeouts will not work correctly.
    setTimeout(() => {
      let textarea = document.querySelector('.TaskProfileTextarea.NowEditing')
      if (textarea) {
        textarea.focus()
      }
    }, 0)
  }

  onClickAddEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entries } = this.state
    let newEntries = JSON.parse(JSON.stringify(entries))
    newEntries.push('')
    this.setState({ nowEditing: newEntries.length-1, savedNowEditing: '', entries: newEntries })
    this.setFocusNowEditing()
    this.updateHideShowWizardNavigation()
  }

  onClickEditEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entries } = this.state
    let current = e.currentTarget;
    let indexString = current.getAttribute('data-entry-index')
    let index = parseInt(indexString, 10)
    this.setState({ nowEditing: index, savedNowEditing: entries[index] })
    this.setFocusNowEditing()
    this.updateHideShowWizardNavigation()
  }

  onClickSaveEntry(e)  {
    e.preventDefault()
    this.setState({ nowEditing: null, savedNowEditing: null })
    this.updatePendingChanges()
  }

  onClickRevertEntry(e)  {
    e.preventDefault()
    let { nowEditing, savedNowEditing, entries } = this.state
    let newEntries = JSON.parse(JSON.stringify(entries))
    newEntries[nowEditing] = savedNowEditing
    this.setState({ nowEditing: null, savedNowEditing: null, entries: newEntries })
    this.updatePendingChanges()
  }

  onClickMoveUp(e)  {
    e.preventDefault()
    let { nowEditing, entries } = this.state
    if (typeof nowEditing === 'number' && nowEditing > 0 && nowEditing < entries.length) {
      let newEntries = JSON.parse(JSON.stringify(entries))
      let saved = newEntries[nowEditing-1]
      newEntries[nowEditing-1] = newEntries[nowEditing]
      newEntries[nowEditing] = saved
      this.setState({ nowEditing: nowEditing-1, entries: newEntries })
      this.updatePendingChanges()
      this.setFocusNowEditing()
    }
  }

  onClickMoveDown(e)  {
    e.preventDefault()
    let { nowEditing, entries } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entries.length-1) {
      let newEntries = JSON.parse(JSON.stringify(entries))
      let saved = newEntries[nowEditing+1]
      newEntries[nowEditing+1] = newEntries[nowEditing]
      newEntries[nowEditing] = saved
      this.setState({ nowEditing: nowEditing+1, entries: newEntries })
      this.updatePendingChanges()
      this.setFocusNowEditing()
    }
  }

  onClickDeleteEntry(e) {
    e.preventDefault()
    let { nowEditing, entries } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entries.length) {
      let newEntries = JSON.parse(JSON.stringify(entries))
      newEntries.splice(nowEditing, 1)
      this.setState({ nowEditing: null, entries: newEntries })
      this.updatePendingChanges()
    }
  }
*/
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
/*
  handleInput(event) {
    let { value } = event.target
    let entries = JSON.parse(JSON.stringify(this.state.entries))
    entries[this.state.nowEditing] = value
    this.setState({ entries })
  }
  */

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

/*
  // FIXME temporary scaffolding until server call to get profile data
  componentWillReceiveProps(nextProps) {
    let oldContent = this.props.content
    let { content, store } = nextProps
    if (content.index === oldContent.index) {
      return
    }
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index } = content
    let { multi } = profileCategories.person[index]
    let lastSavedEntries = multi !== true ? ['z'] : ['1','2']
    this.setState({ entries: lastSavedEntries, lastSavedEntries })
  }
*/

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
    let multi = (name === 'basic' || name === 'internetId') ? false : true
    /*
    // FIXME temporary scaffolding until server call to get profile data
    if (!entries) {
      setTimeout(() => {
        let lastSavedEntries = multi !== true ? ['z'] : ['1','2']
        this.setState({ entries: lastSavedEntries, lastSavedEntries })
      }, 0)
      return (<div></div>)
    }
    */
    let count = 0
    // Do variable substitutions on the long description string
    // Replacement strings can be recursively replaced, so /g isn't sufficient
    let long = substituteVariables(profileCategories.person[index].long, variables, qualifier)
    // Build the list of entries
    let entriesArr = []
    let addNew = ''
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
    }
    /*
    if (entries.length === 0) {
      entriesArr.push(<div key={(count++).toString()} className="TaskProfile">No entries.</div>)
      if (pendingChanges) {
        saveDiscardChangesBottom = saveDiscardChanges
      }
    } else {
      let anyEmpty = false
      for (let i=0; i<entries.length; i++) {
        if (entries[i].trim() === '') {
          anyEmpty = true
        }
        if (i === nowEditing) {
          let upStyle = { visibility: nowEditing > 0 ? 'visible' : 'hidden' }
          let downStyle = { visibility: nowEditing < entries.length-1 ? 'visible' : 'hidden' }
          let removeStyle = { visibility: multi === true ? 'visible' : 'hidden' }
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <textarea className='TaskProfileTextarea NowEditing' value={entries[i]} rows="2"
                placeholder='New entry' onInput={this.handleInput} />
            </div>
            <div className="TaskProfileEditControls">
              <a href="" onClick={this.onClickSaveEntry} data-entry-index={i} >OK</a>
              <span className="TaskProfileSmallSpace"></span>
              <a href="" onClick={this.onClickRevertEntry} data-entry-index={i} >Cancel</a>
              <span className="TaskProfileLargeSpace"></span>
              <a href="" onClick={this.onClickMoveUp} data-entry-index={i} style={upStyle} >Move&#8593;</a>
              <span className="TaskProfileSmallSpace"></span>
              <a href="" onClick={this.onClickMoveDown} data-entry-index={i} style={downStyle} >Move&#8595;</a>
              <span className="TaskProfileLargeSpace"></span>
              <a href="" onClick={this.onClickDeleteEntry} data-entry-index={i} style={removeStyle} >Remove</a>
            </div>
          </div>)
        } else if (typeof nowEditing === 'number'){
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <textarea className='TaskProfileTextarea' value={entries[i]} rows="2" disabled />
            </div>
          </div>)
        } else {
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <div className="TaskProfileEditDiv" onClick={this.onClickEditEntry} data-entry-index={i} >
                <a href="" onClick={this.onClickEditEntry} data-entry-index={i} >Edit</a>
              </div>
              <textarea className='TaskProfileTextarea' value={entries[i]} rows="2" disabled />
            </div>
          </div>)
          if (pendingChanges) {
            saveDiscardChangesTop = saveDiscardChangesBottom = saveDiscardChanges
          }
        }
      }
      if (multi === true) {
        addNew = (<div className="TaskProfileAddNewDiv">
          <a href="" onClick={this.onClickAddEntry} >Add New Entry</a>
        </div>)
      }
      if (anyEmpty) {
        emptyEntries = (<div className="TaskProfileEmptyEntries">Empty entries will be removed with the next Save Changes.</div>)
      }
    }
    */


    /*
    // resize all textarea elements
    setTimeout(()  => {
      let textareas = document.querySelectorAll('.TaskProfileTextarea')
      let currentTextarea = document.querySelector('.TaskProfileTextarea.NowEditing')
      for (let i=0; i<textareas.length; i++) {
        let textarea = textareas[i]
        let max = Math.max(Math.ceil(window.innerHeight* (textarea === currentTextarea ? 0.5 : 0.1)),70)+'px'
        // textarea auto-resize trick
        textarea.style.maxHeight = 'auto'
        textarea.style.height = 'auto'
        textarea.style.height = (textarea.scrollHeight+5)+'px'
        textarea.style.maxHeight = max
      }
    }, 0)
    */
    let category = name
    if (categoryData === null) {
      return <div></div>
    }
    let childComponent = ''
    if (category === 'basic') {

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
        /*
        <div className="TaskProfileEntries">
          {entriesArr}
        </div>
        */
        {addNew}
        {emptyEntries}
        {saveDiscardChangesBottom}
        {childComponent}
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
