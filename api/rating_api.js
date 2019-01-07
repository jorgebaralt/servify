import axios from 'axios';
import _ from 'lodash';

const { CancelToken } = axios;
let source;

export const submitReview = async (service, review, callback) => {
	const data = {
		service,
		review
	};
	const submitReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/postRating';
	try {
		await axios.post(submitReviewUrl, data);
		return callback(review);
	} catch (e) {
		console.log(e);
	}
};

// get all reviews by service
export const getServiceReviews = async (service, callback) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getRatings';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: service,
			cancelToken: source.token
		});
		return callback(data);
	} catch (e) {
		console.log(e);
	}
};

export const getReviews = async (service, userEmail, callback) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getRatings';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: service,
			cancelToken: source.token
		});
		const newData = handleData(data, userEmail);
		if (newData.currentUserReview) {
			return callback(
				newData.currentUserReview,
				newData.data
			);
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
