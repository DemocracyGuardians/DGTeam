
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS'

export function getTasksSuccess(account, progress, tasks) {
  return {
    type: GET_TASKS_SUCCESS,
    account,
    progress,
    tasks
  }
}
