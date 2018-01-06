
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TaskProfileEntries from './TaskProfileEntries'
import substituteVariables from '../../util/substituteVariables'
import './TaskProfileNames.css'

class TaskProfileNameTextEntry extends React.Component {
  constructor(props) {
    super(props)
    let { row, rowData } = this.props
    this.state = {
      row,
      rowData
    }
    this.handleInput = this.handleInput.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    let { row, rowData } = nextProps
    let thisJson = JSON.stringify(this.state.rowData)
    let nextJson = JSON.stringify(rowData)
    if (row !== this.props.row || nextJson !== thisJson) {
      this.setState({ row, rowData })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let { entryDataChanged } = this.props
    let { row, rowData } = this.state
    let prevJson = JSON.stringify(prevState.rowData)
    let thisJson = JSON.stringify(rowData)
    if (row !== prevState.row || thisJson !== prevJson) {
      entryDataChanged(rowData, row, 0)
    }
  }
  handleInput(event) {
    let { value } = event.target
    this.setState({ rowData: [value] })
  }
  render() {
    let { addlClasses, disabled } = this.props
    let { rowData } = this.state
    let clz = 'TaskProfileSimpleTextEntry ' + addlClasses
    return <input className={clz} value={rowData[0]} disabled={disabled} onInput={this.handleInput} ref='TaskProfileNameTextEntry' />
  }
}

class TaskProfileNames extends React.Component {
  constructor(props) {
    super(props)
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
    this.getNewEmptyRowData = this.getNewEmptyRowData.bind(this)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newEntryData } = params
    this.props.updateEditingStatus({ editingInProcess, newCategoryData: { entries: newEntryData } })
  }

  getNewEmptyRowData() {
    return ['']
  }

  render() {
    let { categoryData, store, qualifier } = this.props
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { variables } = profileCategories
    let otherNamesLabel = substituteVariables('Provide all other names by which ((this person)) ((is)) known to the general public.', variables, qualifier)
    return (
      <div className="TaskProfileNames">
        <div className="TaskProfileNamesLegalName">
          <label>
            <div className="TaskProfileNamesLabel">Legal name</div>
            <input/>
          </label>
        </div>
        <div className="TaskProfileNamesOtherNames">
          <div className="TaskProfileNamesOtherNamesLabel">
            {otherNamesLabel}
          </div>
          <TaskProfileEntries store={store} updateEditingStatus={this.updateEditingStatus} getNewEmptyRowData={this.getNewEmptyRowData}
            entryComponent={TaskProfileNameTextEntry} entryData={categoryData.entries} />
        </div>
      </div>
    );
  }
}

TaskProfileNames.propTypes = {
  store: PropTypes.object.isRequired,
  categoryData: PropTypes.object.isRequired,
  updateEditingStatus: PropTypes.func.isRequired,
  qualifier: PropTypes.string.isRequired
}

export default withRouter(TaskProfileNames);
