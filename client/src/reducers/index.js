
import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import userReducer from './userReducer'

const TeamAppReducer = combineReducers({
  user: userReducer,
  login: loginReducer
})

export default TeamAppReducer
