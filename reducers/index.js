import { combineReducers } from 'redux';
import auth from './auth_reducer';
import categories from './categories_reducer';

export default combineReducers({
    auth,
    categories
});
