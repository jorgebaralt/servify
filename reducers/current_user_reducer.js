import {
    STORE_USER_DISPLAY_NAME
} from "../actions/types";

export default (state={},action) =>{
    switch (action.type){
        case STORE_USER_DISPLAY_NAME:
            return{displayName:action.payload};
        default:
            return state;
    }
}
