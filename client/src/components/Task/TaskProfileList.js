
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import TaskProfileEntries from './TaskProfileEntries'
import resizeTextarea from '../../util/resizeTextarea'
import './TaskProfileList.css'

/*
const Label = props => <span>{props.children}</span>
const Button = props => {
    const Inner = props.inner;
    return <button><Inner>Foo</Inner></button>
}
const Page = () => <Button inner={Label}/>

const Label = props => <span>{props.content}</span>
const Tab = props => <div>{props.content}</div>
const Page = () => <Tab content={<Label content='Foo' />} />
*/

class TextareaEntry extends React.Component {
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
    //FIXME relies on knowing about class NowEditing
    let element = this.refs.TextareaEntry
    let clz = element.className
    let nowEditing = clz.indexOf('NowEditing') >= 0
    let maxHeight = Math.max(Math.ceil(window.innerHeight*(nowEditing ? 0.5 : 0.1)),70)+'px'
    resizeTextarea(element, maxHeight)
  }
  handleInput(event) {
    let { value } = event.target
    this.setState({ rowData: [value] })
  }
  render() {
    let { addlClasses, disabled } = this.props
    let { rowData } = this.state
    let clz = 'TaskProfileTextarea ' + addlClasses
    return <textarea className={clz} rows="2" value={rowData[0]} disabled={disabled} onInput={this.handleInput} ref='TextareaEntry' />
  }
}

class TaskProfileList extends React.Component {
  constructor(props) {
    super(props)
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newEntryData } = params
    this.props.updateEditingStatus({ editingInProcess, newCategoryData: newEntryData})
  }

  render() {
    let { categoryData, store, updateEditingStatus } = this.props
    let content = 'TaskProfileList'

    return (
      <div>
        <div className="TaskProfileList" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />
        <TaskProfileEntries store={store} updateEditingStatus={this.updateEditingStatus}
          entryComponent={TextareaEntry} entryData={categoryData} />
      </div>
    );
  }
}

TaskProfileList.propTypes = {
  store: PropTypes.object.isRequired,
  categoryData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,/*,
  content: PropTypes.string.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired*/
  updateEditingStatus: PropTypes.func.isRequired
}

export default withRouter(TaskProfileList);
