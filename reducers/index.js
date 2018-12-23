import { combineReducers } from 'redux';
import auth from './auth_reducer';
import selectedCategory from './select_category_reducer';
import serviceResult from './service_reducer';
import selectedService from './select_service_reducer';
import favoriteServices from './fav_reducer';
import ratings from './rating_reducer';
import help from './help_questions_reducer';
import selectedFaq from './select_faq_reducer';
import location from './location_reducer';

export default combineReducers({
    auth,
    selectedCategory,
    serviceResult,
    selectedService,
    favoriteServices,
    profileList,
    ratings,
    help,
    selectedFaq,
    location
});
