import { SELECT_CATEGORY, DESELECT_CATEGORY } from '../actions/types';

export default (state = {}, action) => {
  switch(action.type){
    case SELECT_CATEGORY:
      return { category: action.payload };
    case DESELECT_CATEGORY:
      return { ...state, category: undefined };
    default:
      return state;
  }
};
