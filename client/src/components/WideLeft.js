
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu, Label } from 'semantic-ui-react'
import { getPageNameFromUrl, getIconFromPageName, getLabelFromPageName } from '../util/workbenchPages'
import './WideLeft.css'

class WideLeft extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    let activePage = getPageNameFromUrl()
    return (
      <div className="WideLeft">
        <Menu icon='labeled' vertical>
          <Menu.Item className="teamlogomenuitem" name='teamlogo' active={false} onClick={this.handleItemClick}>
            <i className="icon"><span className="logotext">Logo</span></i>
            &nbsp;
          </Menu.Item>
          <Menu.Item name='profile' active={activePage === 'profile'} onClick={this.handleItemClick}>
            <Label color="teal">1</Label>
            <Icon name={getIconFromPageName('profile')} />
            {getLabelFromPageName('profile')}
          </Menu.Item>
          <Menu.Item name='trustworthiness' active={activePage === 'trustworthiness'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('trustworthiness')} />
            {getLabelFromPageName('trustworthiness')}
          </Menu.Item>
          <Menu.Item name='level' active={activePage === 'level'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('level')} />
            {getLabelFromPageName('level')}
          </Menu.Item>
          <Menu.Item name='rewards' active={activePage === 'rewards'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('rewards')} />
            {getLabelFromPageName('rewards')}
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

WideLeft.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideLeft);
