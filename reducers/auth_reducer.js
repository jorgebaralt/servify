import {
	GET_CURRENT_USER,
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case GET_CURRENT_USER:
			return { ...state, user: action.payload };
		default:
			return state;
	}
};
