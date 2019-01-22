import axios from 'axios';

const feedbackURL = 'https://us-central1-servify-716c6.cloudfunctions.net/feedback';

// Submit a feedback
export const submitFeedback = async (feedback, callback) => {
	try {
		await axios.post(feedbackURL, feedback);
		callback('Feedback successfully submitted', 'success');
	} catch (e) {
		console.log(e);
		callback('An error has ocurred', 'warning');
	}
};
