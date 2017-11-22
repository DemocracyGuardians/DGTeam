
export const GET_LESSON_SUCCESS = 'GET_LESSON_SUCCESS'

export function getLessonSuccess(account, progress, tasks) {
  return {
    type: GET_LESSON_SUCCESS,
    account,
    progress,
    tasks
  }
}

export const LESSON_UPDATE_PROGRESS_SUCCESS = 'LESSON_UPDATE_PROGRESS_SUCCESS'

export function lessonUpdateProgressSuccess(account, progress, tasks) {
  return {
    type: LESSON_UPDATE_PROGRESS_SUCCESS,
    account,
    progress,
    tasks
  }
}

export const LESSON_REVERT_PROGRESS_SUCCESS = 'LESSON_REVERT_PROGRESS_SUCCESS'

export function lessonRevertProgressSuccess(account, progress, tasks) {
  return {
    type: LESSON_REVERT_PROGRESS_SUCCESS,
    account,
    progress,
    tasks
  }
}
