
// Auto-incremented by node script <root>/server/newtasksversion.js,
// which also copies the previous version into <root>/server/Tasks/old/<oldversion#>.js
let VERSION = 1

module.exports = {
  version: VERSION,

  // Maps version (VERSION-1) values for params={level,tasknum,step} to
  // (VERSION-1) values for params={level,tasknum,step}
  mappingFunc: (params => {
    return { version: VERSION, level: 1, tasknum: 0, step:0 }
  }),

  levels: [
    {
      tasks: [], // Level zero doesn't exist. Always start with level 1
    },
    {
      tasks: [
        { type: 'Task', name: 'Trustworthiness' },
        { type: 'Task', name: 'Vows' },
        { type: 'Task', name: 'Profile' }
      ]
    }
  ]
}
