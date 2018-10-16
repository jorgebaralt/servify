import { SELECT_FAQ, DESELECT_FAQ } from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case SELECT_FAQ:
			return { faq: action.payload };
		case DESELECT_FAQ:
			return {};
		default:
			return state;
	}
};
