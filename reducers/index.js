import { combineReducers } from 'redux';
import auth from './auth_reducer';
import categories from './category_list_reducer';
import selectedCategory from './select_category_reducer';
import postServiceResult from './post_service_reducer';
import getServiceResult from './get_service_reducer';
import selectedService from './select_service_reducer';
import favoriteServices from './fav_reducer';

export default combineReducers({
    auth,
    categories,
    selectedCategory,
    postServiceResult,
    getServiceResult,
    selectedService,
    favoriteServices
});
