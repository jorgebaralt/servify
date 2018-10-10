import {
	GET_REVIEWS_SUCCESS,
	GET_REVIEWS_FAIL,
	USER_ALREADY_REVIEW,
	RESET_REVIEW,
	DELETE_REVIEW_SUCCESS
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case USER_ALREADY_REVIEW:
			return { ...state, currentUserReview: action.payload };
		case GET_REVIEWS_SUCCESS:
			return { ...state, reviews: action.payload };
		case GET_REVIEWS_FAIL:
			return { ...state, reviews: undefined };
		case DELETE_REVIEW_SUCCESS:
			return { ...state, currentUserReview: undefined };
		case RESET_REVIEW:
			return {};
		default:
			return state;
	}
};
