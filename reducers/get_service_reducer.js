import {
    GET_CATEGORY_FAIL,
    GET_CATEGORY_SUCCESS,
    GET_SUBCATEGORY_FAIL,
    GET_SUBCATEGORY_SUCCESS
} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case GET_CATEGORY_FAIL:
            return state;
        case GET_CATEGORY_SUCCESS:
            return { servicesList: action.payload };
        case GET_SUBCATEGORY_FAIL:
            return state;
        case GET_SUBCATEGORY_SUCCESS:
            return { servicesList: action.payload };
        default:
            return state;
    }
};
