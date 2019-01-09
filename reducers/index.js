import { combineReducers } from 'redux';
import auth from './auth_reducer';
import location from './location_reducer';
import toast from './toast_reducer';

export default combineReducers({
    auth,
    location,
    toast
});
