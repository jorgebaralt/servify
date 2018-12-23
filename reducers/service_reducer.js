import {
	POST_SERVICE_FAIL,
	GET_SERVICES_FAIL,
	GET_SERVICES_SUCCESS,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	UPDATE_SERVICE_SUCCESS,
	UPDATE_SERVICE_FAIL,
	CLEAN_POPULAR_NEAR_SERVICES,
	RESET_MESSAGE_POST
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case RESET_MESSAGE_POST:
			return { ...state, error: undefined, success: undefined };
		case POST_SERVICE_FAIL:
			return { ...state, error: action.payload };
		case GET_SERVICES_FAIL:
			return { ...state, serviceList: undefined };
		case GET_SERVICES_SUCCESS:
			return { ...state, servicesList: action.payload };
		case DELETE_SERVICE_SUCCESS:
			return { ...state, success: action.payload };
		case DELETE_SERVICE_FAIL:
			return { ...state, error: action.payload };
		case UPDATE_SERVICE_SUCCESS:
			return { ...state, success: action.payload };
		case UPDATE_SERVICE_FAIL:
			return { ...state, error: action.payload };
		case CLEAN_POPULAR_NEAR_SERVICES:
			return { ...state, servicesList: [] };
		default:
			return state;
	}
};
