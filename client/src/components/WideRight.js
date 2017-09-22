
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './WideRight.css'

class WideRight extends React.Component {
  render() {
    let { showRightColumn } = this.props
    let comp = showRightColumn ? <div>something</div> : <div>nothing</div>
    let style = showRightColumn ? {} : { display: 'none'  }
    return (
      <div className="WideRight" style={style}>
        <div>WideRight</div>
        {comp}
      </div>
    );
  }
}

WideRight.propTypes = {
  store: PropTypes.object.isRequired,
  showRightColumn: PropTypes.bool.isRequired
}

export default withRouter(WideRight);
