import axios from 'axios';
import _ from 'lodash';

const { CancelToken } = axios;
let source;

export const submitReview = async (service, review) => {
	const data = {
		service,
		review
	};
	const submitReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/postRating';
	try {
		await axios.post(submitReviewUrl, data);
		return review;
	} catch (e) {
		console.log(e);
	}
};

// get all reviews by service
export const getServiceReviews = async (service) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getRatings';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: service,
			cancelToken: source.token
		});
		return data;
	} catch (e) {
		console.log(e);
	}
};

export const getReviews = (service, userEmail) => async (dispatch) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getRatings';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: service,
			cancelToken: source.token
		});
		const newData = handleData(data, userEmail);
		if (newData.currentUserReview) {
			// dispatch({
			// 	type: USER_ALREADY_REVIEW,
			// 	payload: newData.currentUserReview
			// });
			// dispatch({ type: GET_REVIEWS_SUCCESS, payload: newData.data });
			return {
				currentUSerReview: newData.currentUSerReview,
				reviews: newData.data
			};
		} 
			// dispatch({
			// 	type: USER_NEVER_REVIEW
			// });
			// dispatch({ type: GET_REVIEWS_SUCCESS, payload: newData });
			return { currentUserReview: null, reviews: newData };
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

export const deleteReview = async (service, review) => {
	const deleteReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteRating';
	const data = {
		service,
		review
	};

	try {
		await axios.delete(deleteReviewUrl, { data });
	} catch (e) {
		console.log(e);
	}
};

export const cancelAxiosRating = () => async (dispatch) => {
	await source.cancel();
};
