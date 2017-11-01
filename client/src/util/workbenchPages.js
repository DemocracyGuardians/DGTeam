
const pageNameXref = {
  Inbox: { icon: 'inbox', label: 'Inbox' },
  Learn: { icon: 'student', label: 'Lessons' },
  Investigate: { icon: 'detective', label: 'Investigate' },
  Judge: { icon: 'legal', label: 'Judge' },
  Search: { icon: 'search', label: 'Search' },
  Profile: { icon: 'id card outline', label: 'My Profile' },
  Trustworthiness: { icon: 'thumbs outline up', label: 'My Trustworthiness' },
  Level: { icon: 'flask', label: 'My Level' },
  Rewards: { icon: 'dollar', label: 'My Rewards' }
}

function getTokens() {
  let pathname = window.location.pathname
  //fixme restore let relativePath = pathname.substr(TEAM_UI_RELATIVE_PATH.length+1)
  let relativePath = pathname.substr(1)
  return relativePath.split('/')
}

/**
 * Returns the name of the first segment of the path. Often, the section of the Workbench.
 */
export function getPathRootFromUrl() {
  return getTokens()[0]
}

/**
 * Returns the name of the menu icon corresponding to the workbench page
 */
export function getIconFromPageName(pageName) {
  return pageName && pageNameXref[pageName] && pageNameXref[pageName].icon
}

/**
 * Returns the label corresponding to the workbench page
 */
export function getLabelFromPageName(pageName) {
  return pageName && pageNameXref[pageName] && pageNameXref[pageName].label
}
