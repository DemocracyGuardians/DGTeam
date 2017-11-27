
import {
  GET_TASKS_SUCCESS
} from '../actions/taskActions'
import {
  GET_INBOX_SUCCESS
} from '../actions/inboxActions'
import {
  GET_TASK_SUCCESS,
  TASK_UPDATE_PROGRESS_SUCCESS,
  TASK_REVERT_PROGRESS_SUCCESS
} from '../actions/taskActions'

export default function tasksReducer(state = null, action) {
  switch (action.type) {
    case GET_TASKS_SUCCESS:
    case GET_INBOX_SUCCESS:
    case GET_TASK_SUCCESS:
    case TASK_UPDATE_PROGRESS_SUCCESS:
    case TASK_REVERT_PROGRESS_SUCCESS:
      return Object.assign({}, state, action.tasks )
    default:
      return state || null
  }
}
