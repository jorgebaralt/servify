import { combineReducers } from 'redux';
import auth from './auth_reducer';
import location from './location_reducer';

export default combineReducers({
    auth,
    location
});
