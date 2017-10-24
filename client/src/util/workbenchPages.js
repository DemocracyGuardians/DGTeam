
const pageNameXref = {
  Inbox: { icon: 'inbox', label: 'Inbox' },
  Learn: { icon: 'student', label: 'Learn' },
  Evidence: { icon: 'detective', label: 'Evidence' },
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
 * Returns the name of the workbench page to show
 */
export function getPageNameFromUrl() {
  return getTokens()[0]
}

/**
 * Returns the id of the resource to show for the given workbenchpage
 */
export function getResourceIdFromUrl() {
  return getTokens()[1]
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
