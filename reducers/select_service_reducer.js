import {SELECT_SERVICE} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case SELECT_SERVICE:
            return { service: action.payload };
        default:
            return state;
    }
};
