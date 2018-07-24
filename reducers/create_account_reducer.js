import {    
    CREATE_ACCOUNT_FAIL,
    CREATE_ACCOUNT_SUCCESS
} from '../actions/types';

export default function(state={}, action){
    switch(action.type){
        case CREATE_ACCOUNT_FAIL:
            return {message:action.payload}
        case CREATE_ACCOUNT_SUCCESS:
            return {user:action.payload}
        default:
            return state;     
    }
}