
import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import signupReducer from './signupReducer'
import userReducer from './userReducer'

const TeamAppReducer = combineReducers({
  user: userReducer,
  login: loginReducer,
  signup: signupReducer
})

export default TeamAppReducer
