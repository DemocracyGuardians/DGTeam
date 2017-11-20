
/**
 * Returns the current value of localProgress (level, task, subtask) pullef from localStorage
 */
export function getLocalProgress() {
  let localProgress = JSON.parse(localStorage.getItem("teamAppLocalProgress"))
  if (!localProgress) {
    localProgress = { level:1, task:0, subtask:0 }
  }
  return localProgress
}

/**
 * Returns the name of the menu icon corresponding to the workbench page
 */
export function setLocalProgress(localProgress) {
  localStorage.setItem("teamAppLocalProgress", JSON.stringify(localProgress))
}
