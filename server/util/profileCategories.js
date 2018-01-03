
module.exports = {

  // task types that expand into multiple steps in the task wizard
  profileTypes: ['TaskYourProfileWizard', 'TaskPersonProfileWizard', 'TaskOrgProfileWizard'],
  profileQualifiers: ['you', 'person', 'org'],

  // In the profile wizard, each category gets its own screen (step).
  // Each category must have 'name' and 'long' (long description)
  // Optional properties are:
  //   qualifier:internetPlatform if this category requires an extra qualifier value
  person: [
    { name:'basic', title:'((This person\'s)) basic vital identity information', long:`((basic))`},
    { name:'names', title:'((This person\'s)) names', long:`((names))`},
    { name:'internetId', title:'((This person\'s)) Internet and social media IDs', qualifier:'internetPlatform', long:`
      List all of the relevant Internet websites, social media accounts or other Web/Internet addresses or identities
      that ((this person)) ((has)).`},
    { name:'education', title:'((This person\'s)) education', long:`
      Provide any pertinent information about ((this person\'s)) education.`},
    { name:'employment', title:'((This person\'s)) employment history', long:`
      Provide any pertinent information about ((this person\'s)) employment history.`},
    { name:'activity', title:'((This person\'s)) activities and associations', long:`
      Provide any other pertinent information about ((this person\'s)) activities and associations.`},
    { name:'financial', title:'((This person\'s)) financial trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness in financial relationships.</p>
      <p>Example trustworthy behavior: always honor financial obligations.</p>
      <p>Example untrustworthy behavior: stealing, cheating and reneging on financial obligations.</p>
      ((OkPreferNot))`},
    { name:'legal', title:'((This person\'s)) legal and criminal trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness with regard to legal and criminal behavior.</p>
      <p>Example trustworthy behavior: never in legal or criminal trouble.</p>
      <p>Example untrustworthy behavior: convictions or court judgments against.</p>
      ((OkPreferNot))`},
    { name:'relationships', title:'((This person\'s)) relationship trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness in personal relationships.</p>
      <p>Example trustworthy behavior: honesty and honoring marriage vows.</p>
      <p>Example untrustworthy behavior: murder, sexual assault/harassment, lying, cheating and abuse.</p>
      ((OkPreferNot))`},
    { name:'other', title:'Other relevant information about ((this person))', long:`
      Provide any other pertinent information about ((this person)).`}
  ],

  // Possible values for qualifier property, with supporting details
  qualifiers: {
    internetPlatform: [
      { name:'website', title:'Website or blog', multiple:true },
      { name:'facebook', title:'Facebook', multiple:false },
      { name:'twitter', title:'Facebook', multiple:false },
      { name:'linkedin', title:'Facebook', multiple:false }
    ]
  },

  // Substitution values
  // Three possible values for when completing a profile for you, another person or an organization
  // if all is present, that matches any qualifier
  // If a value is missing, for ((blah))  use "blah"
  variables: {
    '((is))':  { you:'are'},
    '((has))':  { you:'have'},
    '((A person\'s))':  { you:'Your', org:'An organization\'s'},
    '((person))': { org:'organization' },
    '((people))': { org:'organizations' },
    '((this person))': { you:'you', org:'this organization' },
    '((this person\'s))': { you:'your', org:'this organization\'s' },
    '((This person\'s))': { you:'Your', org:'This organization\'s' },
    '((the person\'s))': { you:'your', org:'the organization\'s' },
    '((If possible, include))': { you:'Include'},
    '((official_examples))': { you:'a passport, driver\'s license or tax return', person:'a passport, driver\'s license or tax return', org:'contracts or government forms' },
    '((basic))': { all: `
      Provide basic identity information that will help to uniquely distinguish ((this person)) versus other ((people))
      with the same or similar names.
      ((If possible, include)) ((the person\'s)) legal name, such as would appear on
      ((official_examples)).
      `},
    '((names))': { all: `
      List all names by which ((this person)) ((is)) commonly known
      to the general public. Include nicknames if used in public situations.
      `},
    '((OkPreferNot))': { you:`<p>If you have been untrustworthy in the past and now you have improved your behavior,
      feel free to confess and explain how you have redeemed yourself.
      If you acted in a way that could be construed as untrustworthy but
      there were special circumstances that justified the behavior,
      feel free to explain the situation and circumstances. </p>
      <p>If you prefer not to answer, then leave this section blank.</p>`, person:'', org:'' }
  }

}
