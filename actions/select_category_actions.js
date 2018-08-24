import { SELECT_CATEGORY, DESELECT_CATEGORY, SELECT_SUBCATEGORY, DESELECT_SUBCATEGORY } from './types';

export const selectCategory = (category) => (dispatch) => {
  dispatch({ type: SELECT_CATEGORY, payload: category });
};

export const deselectCategory = () => (dispatch) => {
  dispatch({ type: DESELECT_CATEGORY });
};

export const selectSubcategory = (subcategory) => (dispatch) => {
  dispatch({ type: SELECT_SUBCATEGORY, payload: subcategory });
};

export const deselectSubcategory = () => (dispatch) => {
  dispatch({ type: DESELECT_SUBCATEGORY });
};
