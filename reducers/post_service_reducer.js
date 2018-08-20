import { 
    POST_SERVICE_SUCCESS, 
    POST_SERVICE_FAIL, 
    RESET_MESSAGE_POST 
} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case POST_SERVICE_FAIL:
            return { error: action.payload };
        case POST_SERVICE_SUCCESS:
            return { success: action.payload };
        case RESET_MESSAGE_POST:
            return {};
        default:
            return state;
    }
};
