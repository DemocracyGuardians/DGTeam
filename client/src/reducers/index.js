
import { combineReducers } from 'redux'
import userReducer from './userReducer'

const TeamAppReducer = combineReducers({
  user: userReducer
})

export default TeamAppReducer
