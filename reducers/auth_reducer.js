import {
    FACEBOOK_LOGIN_FAIL,
    FACEBOOK_LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from "../actions/types";

export default function (state= {}, action){
    switch (action.type){
        case FACEBOOK_LOGIN_SUCCESS:
            return {token:action.payload};
        case FACEBOOK_LOGIN_FAIL:
            return {token: null};
        case LOGIN_SUCCESS:
            return {user:action.payload};
        case LOGIN_FAIL:
            return {message:action.payload};
        default:
            return state;
    }
}
