import {
	POST_FEEDBACK_FAIL,
	POST_FEEDBACK_SUCCESS
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case POST_FEEDBACK_SUCCESS:
			console.log('good');
			return { message: action.payload };
		case POST_FEEDBACK_FAIL:
			console.log('bad');
			return { message: action.payload };
		default:
			return state;
	}
};