import { SELECT_CATEGORY, DESELECT_CATEGORY, SELECT_SUBCATEGORY, DESELECT_SUBCATEGORY } from '../actions/types';

export default (state = {}, action) => {
  switch(action.type){
    case SELECT_CATEGORY:
      return { category: action.payload };
    case DESELECT_CATEGORY:
      return { ...state, category: undefined };
    case SELECT_SUBCATEGORY:
      return { ...state, subcategory: action.payload };
    case DESELECT_SUBCATEGORY:
      return { ...state, subcategory: undefined };
    default:
      return state;
  }
};
