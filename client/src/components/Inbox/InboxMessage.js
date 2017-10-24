
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { Feed, Icon, Menu } from 'semantic-ui-react'
import { getResourceIdFromUrl } from '../../util/workbenchPages'
import './InboxMessage.css'

let notifications = [
  {
    id: '1',
    when: '3 hours ago',
    subject: 'Welcome! Now take your first course: <em>Setting Up Your Profile</em>',
    from: '(automatically generated)',
    content: 'Blah'
  },
  {
    id: '2',
    when: '3 hours ago',
    subject: 'Welcome! Now take your first course: <em>Setting Up Your Profile</em>',
    from: '(automatically generated)',
    content: 'Blah'
  }
]

let getItem = ((arr, id) => {
  return arr.find(item => item.id === id)
})

class InboxMessage extends React.Component {

  handleBackIconClick = (index, e) => {
    this.props.history.push('/Inbox')
  }

  handleDeleteIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  render() {
    let id = getResourceIdFromUrl()
    let item = getItem(notifications, id)
    return (
      <div className="InboxMessage">
        <div className="InboxMessageMenu SecondaryMenu">
          <Menu secondary >
            <Menu.Item name='back' onClick={this.handleBackIconClick} fitted={false} >
              <Icon name='chevron left' size='large' inverted />
            </Menu.Item>
            <Menu.Item name='delete' onClick={this.handleDeleteIconClick} fitted={false} >
              <Icon name='delete' size='large' inverted />
            </Menu.Item>
          </Menu>
        </div>
        <Feed>
          <Feed.Event>
            <Feed.Content>
              <Feed.Summary>
                <Feed.Date dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.when)}} />
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.subject)}} />
              </Feed.Summary>
              <Feed.Extra text>
                <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.content)}} />
              </Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </div>
    );
  }
}

InboxMessage.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(InboxMessage);
