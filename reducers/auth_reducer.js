import {
    STORE_USER_DISPLAY_NAME,
    LOG_OUT,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    RESET_MESSAGE_CREATE,
    GET_EMAIL_SUCCESS,
    GET_EMAIL_FAIL
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type){
        case STORE_USER_DISPLAY_NAME:
            return { ...state, displayName: action.payload };
        case LOGIN_SUCCESS:
            return { ...state, displayName: action.payload };
        case LOGIN_FAIL:
            return { displayName: undefined, message: action.payload };
        case LOG_OUT:
            return { displayName: undefined };
        case GET_EMAIL_SUCCESS:
            return { ...state, email: action.payload };
        case GET_EMAIL_FAIL:
            return { ...state };
        case RESET_MESSAGE_CREATE:
            return { ...state, message: undefined };
        default:
            return state;
    }
};
