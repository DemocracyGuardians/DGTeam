
export const PROGRESS_INCREMENT_SUCCESS = 'PROGRESS_INCREMENT_SUCCESS'

export function progressIncrementSuccess(progress) {
  return {
    type: PROGRESS_INCREMENT_SUCCESS,
    progress
  }
}
