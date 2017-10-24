
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu, Label } from 'semantic-ui-react'
import { getPageNameFromUrl, getIconFromPageName, getLabelFromPageName } from '../../util/workbenchPages'
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
          <Menu.Item name='Profile' active={activePage === 'Profile'} onClick={this.handleItemClick}>
            <Label color="teal">1</Label>
            <Icon name={getIconFromPageName('Profile')} />
            {getLabelFromPageName('Profile')}
          </Menu.Item>
          <Menu.Item name='Trustworthiness' active={activePage === 'Trustworthiness'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('Trustworthiness')} />
            {getLabelFromPageName('Trustworthiness')}
          </Menu.Item>
          <Menu.Item name='Level' active={activePage === 'Level'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('Level')} />
            {getLabelFromPageName('Level')}
          </Menu.Item>
          <Menu.Item name='Rewards' active={activePage === 'Rewards'} onClick={this.handleItemClick}>
            <Icon name={getIconFromPageName('Rewards')} />
            {getLabelFromPageName('Rewards')}
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
