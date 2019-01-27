import axios from 'axios';

const { CancelToken } = axios;
let source;
const reviewURL = 'https://us-central1-servify-716c6.cloudfunctions.net/review';
const reviewsURL = 'https://us-central1-servify-716c6.cloudfunctions.net/reviews';

// Submit a review to db
export const submitReview = async (serviceId, review, callback) => {
	try {
		await axios.post(reviewURL, { serviceId, review });
		return callback(review);
	} catch (e) {
		console.log(e);
	}
};

// get all reviews by service
export const getServiceReviews = async (serviceId, callback) => {
	try {
		source = CancelToken.source();
		const { data } = await axios.get(reviewsURL, {
			params: { serviceId },
			cancelToken: source.token
		});
		return callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get reviews and except current user from list
export const getReviews = async (serviceId, uid, callback) => {
	try {
		source = CancelToken.source();
		const { data } = await axios.get(reviewsURL, {
			params: { serviceId, uid },
			cancelToken: source.token
		});
		return callback(data.userReview, data.reviews.splice(6));
	} catch (e) {
		console.log(e);
	}
};

export const deleteReview = async (review, callback) => {
	try {
		await axios.delete(reviewURL, {
			data: {
				review
		} });
		callback();
	} catch (e) {
		console.log(e);
	}
};

export const cancelAxiosRating = async () => {
	await source.cancel();
};
