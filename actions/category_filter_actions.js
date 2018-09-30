import { NEW_FILTER_SUCCESS, NEW_FILTER_EMPTY } from './types';

export const filterCategories = (categories) => (dispatch) => {
	dispatch({ type: NEW_FILTER_SUCCESS, payload: categories });
};

export const filterEmpty = () => dispatch => {
	return dispatch({ type: NEW_FILTER_EMPTY });
};
