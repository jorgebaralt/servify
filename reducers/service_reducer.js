import {
	POST_SERVICE_SUCCESS,
	POST_SERVICE_FAIL,
	RESET_MESSAGE_POST,
	GET_SERVICES_FAIL,
	GET_SERVICES_SUCCESS,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	UPDATE_SERVICE_SUCCESS,
	UPDATE_SERVICE_FAIL,
	GET_NEAR_SERVICES_SUCCESS,
	GET_NEAR_SERVICES_FAIL,
	GET_POPULAR_CATEGORY_SUCCESS,
	GET_POPULAR_CATEGORY_FAIL,
	GET_POPULAR_SERVICES_SUCCESS,
	GET_POPULAR_SERVICES_FAIL,
	CLEAN_POPULAR_NEAR_SERVICES
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case POST_SERVICE_FAIL:
			return { ...state, error: action.payload };
		case POST_SERVICE_SUCCESS:
			return { ...state, success: action.payload };
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
		case RESET_MESSAGE_POST:
			return { ...state, error: undefined, success: undefined };
		case GET_NEAR_SERVICES_SUCCESS:
			return { ...state, nearServicesList: action.payload };
		case GET_NEAR_SERVICES_FAIL:
			return { ...state, nearServicesList: undefined };
		case GET_POPULAR_CATEGORY_SUCCESS:
			return { ...state, popularCategory: action.payload };
		case GET_POPULAR_CATEGORY_FAIL:
			return { ...state, popularCategory: undefined };
		case GET_POPULAR_SERVICES_SUCCESS:
			return { ...state, popularNearServices: action.payload };
		case GET_POPULAR_SERVICES_FAIL:
			return { ...state, popularNearServices: undefined };
		case CLEAN_POPULAR_NEAR_SERVICES:
			return { ...state, servicesList: [] };
		default:
			return state;
	}
};
