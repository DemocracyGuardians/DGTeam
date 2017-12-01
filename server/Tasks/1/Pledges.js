
//   title: 'Your Pledges'
module.exports = {
  steps: [
    {
      type: 'TaskProse',
      title: '',
      content: `
        <p>A pledge is a promise about future behavior.</p>

        <p>To participate as a member of the Democracy Guardians team, you must commit to a series of pledges regarding your behavior when engaged in any Democracy Guardians activities.</p>

        <p>The following pages contain <strong>Democracy Guardians' Basic Pledges</strong>. Press "Next" to proceed.</p>
`
    },
    {
      type: 'TaskConfirmPledge',
      title: 'Pledge',
      content: 'I pledge to be honest and trustworthy in all my activities with this organization.'
    },
    {
      type: 'TaskConfirmPledge',
      title: 'Pledge',
      content: 'I pledge to be be thoughtful and open-minded in all my activities with this organization where I recognize that different people have different points of view and that another person\'s opinions are just as valid as mine.'
    }
  ]
}
