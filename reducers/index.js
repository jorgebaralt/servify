import {combineReducers} from 'redux';
import auth from './auth_reducer'
import createAccount from './create_account_reducer';
import currentUser from './current_user_reducer'
export default combineReducers({
    auth,
    createAccount,
    currentUser
})