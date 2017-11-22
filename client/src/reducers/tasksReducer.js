
import {
  GET_INBOX_SUCCESS
} from '../actions/inboxActions'
import {
  GET_LESSON_SUCCESS,
  LESSON_UPDATE_PROGRESS_SUCCESS,
  LESSON_REVERT_PROGRESS_SUCCESS
} from '../actions/lessonActions'

export default function tasksReducer(state = null, action) {
  switch (action.type) {
    case GET_INBOX_SUCCESS:
    case GET_LESSON_SUCCESS:
    case LESSON_UPDATE_PROGRESS_SUCCESS:
    case LESSON_REVERT_PROGRESS_SUCCESS:
      return Object.assign({}, state, action.tasks )
    default:
      return state || null
  }
}
