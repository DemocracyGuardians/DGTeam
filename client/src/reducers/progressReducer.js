
import {
  PROGRESS_INCREMENT_SUCCESS
} from '../actions/progressActions'
import {
  GET_INBOX_SUCCESS
} from '../actions/inboxActions'
import {
  GET_LESSON_SUCCESS
} from '../actions/lessonActions'

export default function progressReducer(state = null, action) {
  switch (action.type) {
    case GET_INBOX_SUCCESS:
    case GET_LESSON_SUCCESS:
      return Object.assign({}, state, action.progress )
    case PROGRESS_INCREMENT_SUCCESS:
      return Object.assign({}, state, action.progress )
    default:
      return state || null
  }
}
