import {
	POST_FEEDBACK_FAIL,
	POST_FEEDBACK_SUCCESS,
	RESET_FEEDBACK_MESSAGE
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case POST_FEEDBACK_SUCCESS:
			return { success: action.payload };
		case POST_FEEDBACK_FAIL:
			return { error: action.payload };
		case RESET_FEEDBACK_MESSAGE:
			return {};
		default:
			return state;
	}
};
