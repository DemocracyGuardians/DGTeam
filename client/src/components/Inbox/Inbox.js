
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { Checkbox, Feed, Icon, Input, Menu } from 'semantic-ui-react'
import InboxMoreMenu from './InboxMoreMenu'
import './Inbox.css'

let notifications = [
  {
    id: '1',
    when: '3 hours ago',
    subject: '<span class="AppTaskPressmeHighlight">Welcome! Press here to start</span>',
    from: '(automatically generated)',
    content: `
Blah
    `
  }
]

class Inbox extends React.Component {

  handleItemClick = (item, e) => {
    this.props.history.push('/Inbox/'+item.id)
  }

  handleFilterIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleUndoIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleDeleteIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleSelectAllClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  render() {
    let { store } = this.props
    return (
      <div className="Inbox">
        <div className="InboxMenu SecondaryMenu">
          <Menu secondary size='mini' >
            <Menu.Item name='selectall' className='InboxSelectAll' onClick={this.handleSelectAllClick} fitted={false} >
              <Checkbox checked={false} fitted={false} />
            </Menu.Item>
            <Menu.Item name='undo' onClick={this.handleUndoIconClick} fitted={false} >
              <Icon name='undo' size='large' inverted />
            </Menu.Item>
            <Menu.Item name='delete' onClick={this.handleDeleteIconClick} fitted={false} >
              <Icon name='delete' size='large' inverted />
            </Menu.Item>
            <Menu.Item>
              <Input className='icon' icon='search' placeholder='Search...' />
            </Menu.Item>
            <InboxMoreMenu store={store} />
          </Menu>
        </div>
        <Feed>
          {notifications.map((item, index) => (
            <Feed.Event key={item.id} onClick={this.handleItemClick.bind(this,item)} >
              <Feed.Label className='InboxSelect' >
                <Checkbox checked={false} fitted={false} />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.when)}} />
                <Feed.Summary> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.subject)}} /> </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </div>
    );
  }
}

Inbox.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Inbox);
