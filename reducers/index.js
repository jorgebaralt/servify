import { combineReducers } from 'redux';
import auth from './auth_reducer';
import categories from './category_list_reducer';
import selectedCategory from './select_category_reducer';

export default combineReducers({
    auth,
    categories,
    selectedCategory
});
