import {combineReducers} from 'redux';
import auth from './auth_reducer'
import createAccount from './create_account_reducer';
export default combineReducers({
    auth,
    createAccount
})