import {
    STORE_USER_DISPLAY_NAME,
    LOG_OUT,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    RESET_MESSAGE_CREATE
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type){
        case STORE_USER_DISPLAY_NAME:
            return { displayName: action.payload };
        case LOGIN_SUCCESS:
            return { displayName: action.payload };
        case LOGIN_FAIL:
            return { displayName: undefined, message: action.payload };
        case LOG_OUT:
            return { displayName: undefined };
        case RESET_MESSAGE_CREATE:
            return {};
        default:
            return state;
    }
};
