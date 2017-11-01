
import React from 'react';
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { RSAA } from 'redux-api-middleware'
import PropTypes from 'prop-types'
import WideLayout from '../components/Wide/WideLayout'
import ThinLayout from '../components/Thin/ThinLayout'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import './Workbench.css'

var workbenchinitApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/workbenchinit'

class Workbench extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //password: ''
    }
    this.workbenchinit = this.workbenchinit.bind(this);
  }

  workbenchinit() {
    let values = {}
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: workbenchinitApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'workbenchinit_request', // ignored
          {
            type: 'workbenchinit_success',
            payload: (action, state, res) => {
              console.log('workbenchinit_success')
            }
          },
          {
            type: 'workbenchinit_failure',
            payload: (action, state, res) => {
              console.log('workbenchinit_failure')
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
    this.workbenchinit()
    let { store } = this.props
    return (
      <div className="Workbench">
        <MediaQuery minWidth={1024}>
          <WideLayout store={store} showRightColumn={true}  />
        </MediaQuery>
        <MediaQuery minWidth={250} maxWidth={1023}>
          <WideLayout store={store} showRightColumn={false}  />
        </MediaQuery>
        <MediaQuery maxWidth={249}>
          <ThinLayout store={store} />
        </MediaQuery>
      </div>
    );
  }
}

Workbench.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Workbench);
