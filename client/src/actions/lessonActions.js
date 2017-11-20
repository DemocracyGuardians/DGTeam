
export const GET_LESSON_SUCCESS = 'GET_LESSON_SUCCESS'

export function getLessonSuccess(account, progress, tasks) {
  return {
    type: GET_LESSON_SUCCESS,
    account,
    progress,
    tasks
  }
}
