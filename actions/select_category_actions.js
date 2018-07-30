import { SELECT_CATEGORY, DESELECT_CATEGORY } from './types';

export const selectCategory = (category) => (dispatch) => {
  dispatch({ type: SELECT_CATEGORY, payload: category });
};

export const deselectCategory = () => (dispatch) =>{
  dispatch({ type: DESELECT_CATEGORY });
};
