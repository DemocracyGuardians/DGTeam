
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import WideLeft from './WideLeft'
import WideCenter from './WideCenter'
import WideRight from './WideRight'
import './WideLayout.css'

class WideLayout extends React.Component {
  render() {
    let { showRightColumn, store } = this.props
    return (
      <div className="WideLayout">
        <div className="outer">
          <div className="leftmargin"></div>
          <div className="content">
            <div className="columns">
              <WideLeft store={store} />
              <WideCenter store={store} />
              <WideRight showRightColumn={showRightColumn} store={store} />
            </div>
          </div>
          <div className="rightmargin"></div>
        </div>
      </div>
    );
  }
}

WideLayout.propTypes = {
  store: PropTypes.object.isRequired,
  showRightColumn: PropTypes.bool.isRequired
}

export default withRouter(WideLayout);
