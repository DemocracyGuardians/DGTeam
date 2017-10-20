
const pageNameXref = {
  inbox: { icon: 'inbox', label: 'Inbox' },
  learn: { icon: 'student', label: 'Learn' },
  evidence: { icon: 'detective', label: 'Evidence' },
  judge: { icon: 'legal', label: 'Judge' },
  search: { icon: 'search', label: 'Search' },
  profile: { icon: 'id card outline', label: 'My Profile' },
  trustworthiness: { icon: 'thumbs outline up', label: 'My Trustworthiness' },
  level: { icon: 'flask', label: 'My Level' },
  rewards: { icon: 'dollar', label: 'My Rewards' }
}

export function getPageNameFromUrl() {
  let pathname = window.location.pathname
  //fixme restore let relativePath = pathname.substr(TEAM_UI_RELATIVE_PATH.length+1)
  let relativePath = pathname.substr(1)
  return relativePath
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
