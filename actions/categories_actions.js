import { SELECT_CATEGORY } from './types';

export const selectCategory = (category) => (dispatch) => {
  console.log(category.categoryTitle);
  dispatch({ type: SELECT_CATEGORY, payload: category });
};
