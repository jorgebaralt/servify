import {
    STORE_USER_DISPLAY_NAME,
    LOG_OUT,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type){
        case STORE_USER_DISPLAY_NAME:
            return { displayName: action.payload };
        case LOGIN_SUCCESS:
            return { displayName: action.payload };
        case LOGIN_FAIL:
            return { message: action.payload };
        case LOG_OUT:
            return {};
        default:
            return state;
    }
};
