
/**
 * Returns the current value of localProgress (level, task, step) pullef from localStorage
 */
export function getLocalProgress() {
  let email = localStorage.getItem("teamAppEmail")
  let localProgress = JSON.parse(localStorage.getItem("teamAppLocalProgress_"+email))
  if (!localProgress) {
    localProgress = { level:1, task:0, step:0 }
  }
  return localProgress
}

/**
 * Sets the current value of localProgress (level, task, step) pullef from localStorage
 */
export function setLocalProgress(localProgress) {
  //FIXME temporary
  localStorage.removeItem("teamAppLocalProgress")
  let email = localStorage.getItem("teamAppEmail")
  localStorage.setItem("teamAppLocalProgress_"+email, JSON.stringify(localProgress))
}
