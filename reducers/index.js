import { combineReducers } from 'redux';
import auth from './auth_reducer';
import selectedService from './select_service_reducer';
import ratings from './rating_reducer';
import location from './location_reducer';

export default combineReducers({
    auth,
    selectedService,
    ratings,
    location
});
