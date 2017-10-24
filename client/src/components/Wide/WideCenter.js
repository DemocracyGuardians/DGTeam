
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'semantic-ui-react'
import Inbox from '../Inbox/Inbox'
import InboxMessage from '../Inbox/InboxMessage'
import { getPageNameFromUrl, getResourceIdFromUrl, getIconFromPageName, getLabelFromPageName } from '../../util/workbenchPages'
import MoreMenu from '../Workbench/MoreMenu'
import './WideCenter.css'

class WideCenter extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    let activePage = getPageNameFromUrl()
    let resourceId = getResourceIdFromUrl()
    let highlightedPage = activePage
    let { store } = this.props
    let center = <div>FIXME</div>
    switch (activePage) {
      case "Inbox":
        if (resourceId) {
          center = <InboxMessage store={store} />
        } else {
          center = <Inbox store={store} />
        }
        break
      case "Learn":
      case "Evidence":
      case "Judge":
      case "Search":
      default:
    }
    return (
      <div className="WideCenter">
        <div className="WideCenterPrimaryMenu">
          <Menu icon='labeled' >
            <Menu.Item name='Inbox' active={highlightedPage === 'Inbox'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Inbox')} />
              {getLabelFromPageName('Inbox')}
            </Menu.Item>
            <Menu.Item name='Learn' active={highlightedPage === 'Learn'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Learn')} />
              {getLabelFromPageName('Learn')}
            </Menu.Item>
            <Menu.Item name='Evidence' active={highlightedPage === 'Evidence'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Evidence')} />
              {getLabelFromPageName('Evidence')}
            </Menu.Item>
            <Menu.Item name='Judge' active={highlightedPage === 'Judge'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Judge')} />
              {getLabelFromPageName('Judge')}
            </Menu.Item>
            <Menu.Item name='Search' active={highlightedPage === 'Search'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Search')} />
              {getLabelFromPageName('Search')}
            </Menu.Item>
            <MoreMenu store={store} />
          </Menu>
        </div>
        {center}
      </div>
    );
  }
}

WideCenter.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideCenter);
