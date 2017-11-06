
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'semantic-ui-react'
import Inbox from '../Inbox/Inbox'
import InboxMessage from '../Inbox/InboxMessage'
import LessonWizard from '../../containers/LessonWizard'
import { getPathRootFromUrl, getIconFromPageName, getLabelFromPageName } from '../../util/workbenchPages'
import MoreMenu from '../Workbench/MoreMenu'
import './WideCenter.css'

class WideCenter extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    let pathRoot = getPathRootFromUrl()
    let activePage = pathRoot
    let highlightedPage = pathRoot
    let { store } = this.props
    let center = <div>FIXME</div>
    switch (activePage) {
      case "Inbox":
        let { id } = (this.props.match && this.props.match.params) || {}
        if (id) {
          center = <InboxMessage store={store} id={id} />
        } else {
          center = <Inbox store={store} />
        }
        break
      case "Lesson":
        let { level, name } = (this.props.match && this.props.match.params) || {}
        if (!level || !name ) {
          console.error('WideCenter Lesson missing level:'+level+' or name:'+name)
          this.props.history.push('/systemerror')
        }
        center = <LessonWizard store={store} level={level} name={name} />
        activePage = highlightedPage = 'Lessons'
        break
      case "Lessons":
      case "Investigate":
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
            <Menu.Item name='Lessons' active={highlightedPage === 'Lessons'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Lessons')} />
              {getLabelFromPageName('Lessons')}
            </Menu.Item>
            <Menu.Item name='Investigate' active={highlightedPage === 'Investigate'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Investigate')} />
              {getLabelFromPageName('Investigate')}
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
        <div className="WideCenterContent">
          {center}
        </div>
      </div>
    );
  }
}

WideCenter.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideCenter);
