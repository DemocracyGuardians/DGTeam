
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TaskProfileEditableEntry from './TaskProfileEditableEntry'
import './TaskProfileEntries.css'

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
            <TaskProfileEditableEntry dataIndex={i} disabled={false} labelText=''
              entryClasses='NowEditing' entryComponent={entryComponent} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{display:'none'}} upStyle={upStyle} downStyle={downStyle} removeStyle={{}}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
          </div>)

        } else if (typeof nowEditing === 'number'){
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <TaskProfileEditableEntry dataIndex={i} disabled={true} labelText=''
              entryClasses='' entryComponent={entryComponent} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{display:'none'}} upStyle={{visibility:'hidden'}} downStyle={{visibility:'hidden'}} removeStyle={{visibility:'hidden'}}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
          </div>)
        } else {
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <TaskProfileEditableEntry dataIndex={i} disabled={true} labelText=''
              entryClasses='' entryComponent={entryComponent} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{}} upStyle={{visibility:'hidden'}} downStyle={{visibility:'hidden'}} removeStyle={{visibility:'hidden'}}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
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
