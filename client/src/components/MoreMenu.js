
import React from 'react'
import { Icon, Menu, Popup } from 'semantic-ui-react'
import { RSAA } from 'redux-api-middleware';
import { withRouter } from 'react-router-dom'
import { userLogoutSuccess } from '../actions/userActions'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import './MoreMenu.css'

const logoutApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/logout'

class MoreMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  handleItemClick = (e, { name }) => {
    this.setState({ isOpen: false })
    if (name === 'logout') {
      this.logout()
    }
  }

  logout() {
    let values = {}
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: logoutApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'logout_request', // ignored
          {
            type: 'logout_success',
            payload: (action, state, res) => {
              console.log('logout_success')
              dispatch(userLogoutSuccess())
              this.props.history.push('/login')
            }
          },
          {
            type: 'logout_failure',
            payload: (action, state, res) => {
              console.log('logout_failure')
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
    let MoreMenuPopup = () => (
      <Menu icon='labeled' vertical>
        <Menu.Item name='logout' onClick={this.handleItemClick} >
          Logout
        </Menu.Item>
      </Menu>
    )

    return (
      <Popup basic position='bottom right' on="click" className="MoreMenuPopup"
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        trigger={<Menu.Item name='more' >
          <Icon name='ellipsis vertical' />
          More
        </Menu.Item>}
        content={<MoreMenuPopup/>}
      />
    )
  }
}

export default withRouter(MoreMenu)
