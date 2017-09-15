
import React from 'react';
import { Container, Message } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class ResetPasswordSuccess extends React.Component {
  render() {
    let { message } = this.props
    return (
      <Container text className='ResetPasswordSuccess verticalformcontainer'>
        <div className="ResetPasswordSuccess">
          <Message header='Your password has been updated' className='verticalformtopmessage' content={message} />
          <div className='verticalformbuttonrow'>
            <div>To go your home screen, &nbsp;<Link to='/workbench'>click here</Link></div>
            <div style={{clear:'both' }} ></div>
          </div>
        </div>
      </Container>
    )
  }
}

ResetPasswordSuccess.propTypes = {
  store: PropTypes.object.isRequired,
  message: PropTypes.string
}

export default withRouter(ResetPasswordSuccess)
