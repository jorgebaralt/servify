import {
    GET_SERVICES_FAIL,
    GET_SERVICES_SUCCESS
} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case GET_SERVICES_FAIL:
            return state;
        case GET_SERVICES_SUCCESS:
            return { servicesList: action.payload };
        default:
            return state;
    }
};
