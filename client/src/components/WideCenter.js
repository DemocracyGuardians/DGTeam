
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'semantic-ui-react'
import { getPageNameFromUrl, getIconFromPageName, getLabelFromPageName } from '../util/workbenchPages'
import MoreMenu from './MoreMenu'
import './WideCenter.css'

class WideCenter extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    let activePage = getPageNameFromUrl()
    let { store } = this.props
    return (
      <div className="WideCenter">
        <div className="WideCenterPrimaryMenu">
          <Menu icon='labeled' >
            <Menu.Item name='inbox' active={activePage === 'inbox'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('inbox')} />
              {getLabelFromPageName('inbox')}
            </Menu.Item>
            <Menu.Item name='learn' active={activePage === 'learn'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('learn')} />
              {getLabelFromPageName('learn')}
            </Menu.Item>
            <Menu.Item name='evidence' active={activePage === 'evidence'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('evidence')} />
              {getLabelFromPageName('evidence')}
            </Menu.Item>
            <Menu.Item name='judge' active={activePage === 'judge'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('judge')} />
              {getLabelFromPageName('judge')}
            </Menu.Item>
            <Menu.Item name='search' active={activePage === 'search'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('search')} />
              {getLabelFromPageName('search')}
            </Menu.Item>
            <MoreMenu store={store} />
          </Menu>
        </div>
        <div>Content</div>
      </div>
    );
  }
}

WideCenter.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideCenter);
