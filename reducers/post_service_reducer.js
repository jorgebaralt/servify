import { POST_SERVICE_SUCCESS, POST_SERVICE_FAIL } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case POST_SERVICE_FAIL:
            return { error: action.payload };
        case POST_SERVICE_SUCCESS:
            return { success: action.payload };
        default:
            return state;
    }
};
