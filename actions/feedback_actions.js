import axios from 'axios';
import {
	POST_FEEDBACK_SUCCESS,
	POST_FEEDBACK_FAIL,
	RESET_FEEDBACK_MESSAGE
} from './types';

const url = 'https://us-central1-servify-716c6.cloudfunctions.net/postFeedback';

export const submitFeedback = (feedback) => async (dispatch) => {
	try {
		await axios.post(url, feedback);
		dispatch({
			type: POST_FEEDBACK_SUCCESS,
			payload: 'Feedback successfully submitted '
		});
	} catch (e) {
		dispatch({
			type: POST_FEEDBACK_FAIL,
			payload: 'Error submitting feedback '
		});
	}
};

export const resetFeedbackMessage = () => (dispatch) => {
	dispatch({ type: RESET_FEEDBACK_MESSAGE });
};
