import { GET_USER_LOCATION_SUCCESS } from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case GET_USER_LOCATION_SUCCESS:
			return { ...state, data: action.payload };
		default:
			return state;
	}
};
