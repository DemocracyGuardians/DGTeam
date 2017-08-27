
import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import appstateReducer from './appstateReducer'

const TeamAppReducer = combineReducers({
  appstate: appstateReducer,
  login: loginReducer
})

export default TeamAppReducer
