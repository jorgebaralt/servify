import axios from 'axios';
import _ from 'lodash';

const { CancelToken } = axios;
let source;

export const submitReview = async (serviceId, review, callback) => {
	const submitReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/postServiceReview';
	try {
		await axios.post(submitReviewUrl, { serviceId, review });
		return callback(review);
	} catch (e) {
		console.log(e);
	}
};

// get all reviews by service
export const getServiceReviews = async (serviceId, callback) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getServiceReviews';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: { serviceId },
			cancelToken: source.token
		});
		return callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get reviews of just one service
export const getReviews = async (serviceId, userEmail, callback) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getServiceReviews';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: { serviceId },
			cancelToken: source.token
		});
		const newData = handleData(data, userEmail);
		if (newData.currentUserReview) {
			return callback(newData.currentUserReview, newData.data);
		}
		return callback(null, newData);
	} catch (e) {
		console.log(e);
	}
};

// hangle get reviews, first remove current user, then get only 5
const handleData = (data, userEmail) => {
	let postIndex;
	const currentUserReview = _.find(data, (review, i) => {
		if (review.reviewerEmail === userEmail) {
			postIndex = i;
			return review;
		}
	});
	if (currentUserReview) {
		// remove user comment from list
		data.splice(postIndex, 1);
		// limit 5 newest comments
		data.splice(5);
		const newData = {
			data,
			currentUserReview
		};
		return newData;
	}
	return data;
};

export const deleteReview = async (service, review, callback) => {
	const deleteReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteRating';
	const data = {
		service,
		review
	};

	try {
		await axios.delete(deleteReviewUrl, { data });
		callback();
	} catch (e) {
		console.log(e);
	}
};

export const cancelAxiosRating = async () => {
	await source.cancel();
};
