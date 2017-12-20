
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './TaskProfileBasic.css'

class TaskProfileBasic extends React.Component {
  constructor(props) {
    super(props)
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newEntryData } = params
    this.props.updateEditingStatus({ editingInProcess, newCategoryData: newEntryData})
  }

  render() {
    let { categoryData, store } = this.props
    //FIXME generalize the other names label
    return (
      <div className="TaskProfileBasic">
        <div className="TaskProfileBasicLegalName">
          <label>
            <div className="TaskProfileBasicLabel">Legal name</div>
            <input/>
          </label>
        </div>
        <div className="TaskProfileBasicDOB">
          <label>
            <div className="TaskProfileBasicLabel">Birth date</div>
            <input/>
          </label>
        </div>
        <div className="TaskProfileBasicOtherVital">
          <label>
            <div className="TaskProfileBasicLabel">Other vital information, such as place of birth or date of death</div>
            <textarea rows="2" />
          </label>
        </div>
      </div>
    );
  }
}

TaskProfileBasic.propTypes = {
  store: PropTypes.object.isRequired,
  categoryData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  updateEditingStatus: PropTypes.func.isRequired
}

export default withRouter(TaskProfileBasic);
