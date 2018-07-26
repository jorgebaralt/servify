import {
    FACEBOOK_LOGIN_FAIL,
    FACEBOOK_LOGIN_SUCCESS,
    EMAIL_LOGIN_FAIL,
    EMAIL_LOGIN_SUCCESS,
    STORE_USER_DISPLAY_NAME,
    LOG_OUT,
    CREATE_ACCOUNT_SUCCESS,
    CREATE_ACCOUNT_FAIL
} from "../actions/types";

export default function (state= {}, action){
    switch (action.type){
        case FACEBOOK_LOGIN_SUCCESS:
            return {displayName:action.payload};
        case FACEBOOK_LOGIN_FAIL:
            return state={};
        case EMAIL_LOGIN_SUCCESS:
            return {displayName:action.payload};
        case EMAIL_LOGIN_FAIL:
            return {message:action.payload};
        case STORE_USER_DISPLAY_NAME:
            return{displayName:action.payload};
        case CREATE_ACCOUNT_FAIL:
            return {message:action.payload};
        case CREATE_ACCOUNT_SUCCESS:
            return {displayName:action.payload};
        case LOG_OUT:
            return state={};
        default:
            return state;
    }
}
