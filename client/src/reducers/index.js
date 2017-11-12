
import { combineReducers } from 'redux'
import accountReducer from './accountReducer'

const TeamAppReducer = combineReducers({
  account: accountReducer
})

export default TeamAppReducer
