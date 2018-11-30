import { NEW_FILTER_EMPTY, NEW_FILTER_SUCCESS } from '../actions/types';
import categories from '../helper/categories';

const initialState = categories;

export default (state = initialState, action) => {
	switch (action.type) {
		case NEW_FILTER_SUCCESS:
			return action.payload;
		case NEW_FILTER_EMPTY:
			return initialState;
		default:
			return state;
	}
};
