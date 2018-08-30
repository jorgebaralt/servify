import { UPDATE_FAVORITE } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type){
        case UPDATE_FAVORITE:
            return action.payload;
        default:
            return state;
    }
};
