import {
	POST_SERVICE_SUCCESS,
	POST_SERVICE_FAIL,
	RESET_MESSAGE_POST,
	GET_SERVICES_FAIL,
	GET_SERVICES_SUCCESS,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	UPDATE_SERVICE_SUCCESS,
	UPDATE_SERVICE_FAIL
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case POST_SERVICE_FAIL:
			return { error: action.payload };
		case POST_SERVICE_SUCCESS:
			return { success: action.payload };
		case GET_SERVICES_FAIL:
			return state;
		case GET_SERVICES_SUCCESS:
			return { servicesList: action.payload };
		case DELETE_SERVICE_SUCCESS:
			return { success: action.payload };
		case DELETE_SERVICE_FAIL:
			return { error: action.payload };
		case UPDATE_SERVICE_SUCCESS:
			return { success: action.payload };
		case UPDATE_SERVICE_FAIL:
			return { error: action.payload };
		case RESET_MESSAGE_POST:
			return { ...state, error: undefined, success: undefined };
		default:
			return state;
	}
};
