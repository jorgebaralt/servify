import axios from 'axios';
import { POST_FEEDBACK_SUCCESS, POST_SERVICE_FAIL } from './types';

export const submitFeedback = (feedback) => (dispatch) => {
	console.log(feedback);
	dispatch({ type: POST_FEEDBACK_SUCCESS, payload: 'Feedback successfully submitted ' });
};
