
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './TaskProfileEntries.css'

class Entry extends React.Component {
  render() {
    const EntryComponent = this.props.entryComponent
    let { addlClasses, rowData, row, disabled, entryDataChanged } = this.props
    return <EntryComponent rowData={rowData} row={row} disabled={disabled} addlClasses={addlClasses} entryDataChanged={entryDataChanged} />
  }
}

class TaskProfileEntries extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nowEditing: null,
      entryComponent: this.props.entryComponent,
      entryData: this.props.entryData
    }
    this.setFocusNowEditing = this.setFocusNowEditing.bind(this)
    this.onClickAddEntry = this.onClickAddEntry.bind(this)
    this.onClickEditEntry = this.onClickEditEntry.bind(this)
    this.onClickSaveEntry = this.onClickSaveEntry.bind(this)
    this.onClickRevertEntry = this.onClickRevertEntry.bind(this)
    this.onClickMoveUp = this.onClickMoveUp.bind(this)
    this.onClickMoveDown = this.onClickMoveDown.bind(this)
    this.onClickDeleteEntry = this.onClickDeleteEntry.bind(this)
    this.entryDataChanged = this.entryDataChanged.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // FIXME make sure props are different?
    let { entryComponent, entryData } = nextProps
    this.setState({ entryComponent, entryData })
  }

  setFocusNowEditing() {
    //FIXME componentDidUpdate?
    setTimeout(() => {
      let control = document.querySelector('.TaskProfile .NowEditing')
      if (control) {
        control.focus()
      }
    }, 0)
  }

  onClickAddEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entryData } = this.state
    let newEntryData = JSON.parse(JSON.stringify(entryData))
    //FIXME needs to come from parent
    let blankRow = ['']
    newEntryData.push(blankRow)
    this.setState({ nowEditing: newEntryData.length-1, savedNowEditing:[''], entryData: newEntryData })
    this.setFocusNowEditing()
  }

  onClickEditEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entryData } = this.state
    let { updateEditingStatus } = this.props
    let current = e.currentTarget;
    let indexString = current.getAttribute('data-entry-index')
    let index = parseInt(indexString, 10)
    this.setState({ nowEditing: index, savedNowEditing: entryData[index] })
    updateEditingStatus({ editingInProcess: true, newEntryData: entryData })
    this.setFocusNowEditing()
  }

  onClickSaveEntry(e)  {
    e.preventDefault()
    this.setState({ nowEditing: null, savedNowEditing: null })
    this.props.updateEditingStatus({ editingInProcess: false, newEntryData: this.state.entryData })
  }

  onClickRevertEntry(e) {
    e.preventDefault()
    let { nowEditing, savedNowEditing, entryData } = this.state
    let newEntryData = JSON.parse(JSON.stringify(entryData))
    newEntryData[nowEditing] = savedNowEditing
    this.setState({ nowEditing: null, savedNowEditing: null, entryData: newEntryData })
    this.props.updateEditingStatus({ editingInProcess: false, newEntryData })
  }

  onClickMoveUp(e)  {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing > 0 && nowEditing < entryData.length) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      let saved = newEntryData[nowEditing-1]
      newEntryData[nowEditing-1] = newEntryData[nowEditing]
      newEntryData[nowEditing] = saved
      this.setState({ nowEditing: nowEditing-1, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: true, newEntryData })
    }
  }

  onClickMoveDown(e)  {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entryData.length-1) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      let saved = newEntryData[nowEditing+1]
      newEntryData[nowEditing+1] = newEntryData[nowEditing]
      newEntryData[nowEditing] = saved
      this.setState({ nowEditing: nowEditing+1, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: true, newEntryData })
    }
  }

  onClickDeleteEntry(e) {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entryData.length) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      newEntryData.splice(nowEditing, 1)
      this.setState({ nowEditing: null, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: false, newEntryData })
    }
  }

  entryDataChanged(newValue, row) {
    let { entryData } = this.state
    let thisJson = JSON.stringify(entryData[row])
    let newJson = JSON.stringify(newValue)
    if (newJson !== thisJson) {
      let newData = JSON.parse(JSON.stringify(entryData))
      newData[row] = newValue
      this.setState({ entryData: newData })
    }
  }

  render() {
    let { entryComponent, entryData, nowEditing } = this.state
    if (!entryData) {
      return (<div></div>)
    }

    // Build the list of entries
    let entriesArr = []
    let addNew = ''
    let count = 0
    if (entryData.length === 0) {
      entriesArr.push(<div key={(count++).toString()} className="TaskProfileNoEntries">No entries in this section.
        You can add an entry by pressing "Add New Entry".</div>)
    } else {
      for (let i=0; i<entryData.length; i++) {
        if (i === nowEditing) {
          let upStyle = { visibility: nowEditing > 0 ? 'visible' : 'hidden' }
          let downStyle = { visibility: nowEditing < entryData.length-1 ? 'visible' : 'hidden' }
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <Entry entryComponent={entryComponent} rowData={entryData[i]} row={i} disabled={false} entryDataChanged={this.entryDataChanged} addlClasses='NowEditing' />
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
              <a href="" onClick={this.onClickDeleteEntry} data-entry-index={i} >Remove</a>
            </div>
          </div>)
        } else if (typeof nowEditing === 'number'){
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <Entry entryComponent={entryComponent} rowData={entryData[i]} row={i} disabled={true} entryDataChanged={this.entryDataChanged} addlClasses='' />
            </div>
          </div>)
        } else {
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <div className="TaskProfileTextareaRow">
              <div className="TaskProfileEditDiv" onClick={this.onClickEditEntry} data-entry-index={i} >
                <a href="" onClick={this.onClickEditEntry} data-entry-index={i} >Edit</a>
              </div>
              <Entry entryComponent={entryComponent} rowData={entryData[i]} row={i} disabled={true} entryDataChanged={this.entryDataChanged} addlClasses='' />
            </div>
          </div>)
        }
      }
    }
    if (typeof nowEditing !== 'number') {
      addNew = (<div className="TaskProfileAddNewDiv">
        <a href="" onClick={this.onClickAddEntry} >Add New Entry</a>
      </div>)
    }
    return (
      <div className="TaskProfileEntries" >
        {entriesArr}
        {addNew}
      </div>
    );
  }
}

TaskProfileEntries.propTypes = {
  store: PropTypes.object.isRequired,
  entryComponent: PropTypes.func.isRequired,
  entryData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,/*
  content: PropTypes.string.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,*/
  updateEditingStatus: PropTypes.func.isRequired
}

export default withRouter(TaskProfileEntries);
