import axios from 'axios';
import _ from 'lodash';
import {
	SUBMIT_REVIEW_SUCCESS,
	SUBMIT_REVIEW_FAIL,
	GET_REVIEWS_SUCCESS,
	GET_REVIEWS_FAIL,
	USER_ALREADY_REVIEW,
	RESET_REVIEW,
	DELETE_REVIEW_SUCCESS,
	GET_SERVICE_REVIEWS,
	USER_NEVER_REVIEW
} from './types';

// Will be used to cancel axios call
const { CancelToken } = axios;
let source;

export const submitReview = (service, review) => async (dispatch) => {
	const data = {
		service,
		review
	};
	const submitReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/postRating';
	try {
		await axios.post(submitReviewUrl, data);
		dispatch({ type: USER_ALREADY_REVIEW, payload: review });
	} catch (e) {
		console.log(e);
	}
};

export const getServiceReviews = (service) => async (dispatch) => {
	const getReviewsUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getRatings';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(getReviewsUrl, {
			params: service,
			cancelToken: source.token
		});
		dispatch({ type: GET_SERVICE_REVIEWS, payload: data });
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
			dispatch({
				type: USER_ALREADY_REVIEW,
				payload: newData.currentUserReview
			});
			dispatch({ type: GET_REVIEWS_SUCCESS, payload: newData.data });
		} else {
			dispatch({
				type: USER_NEVER_REVIEW
			});
			dispatch({ type: GET_REVIEWS_SUCCESS, payload: newData });
		}
	} catch (e) {
		console.log(e);
	}
};

export const deleteReview = (service, review) => async (dispatch) => {
	const deleteReviewUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteRating';
	const data = {
		service,
		review
	};

	try {
		await axios.delete(deleteReviewUrl, { data });
		return dispatch({ type: DELETE_REVIEW_SUCCESS });
	} catch (e) {
		console.log(e);
	}
};

export const resetReview = () => (dispatch) => dispatch({ type: RESET_REVIEW });

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

export const cancelAxiosRating = () => async (dispatch) => {
	await source.cancel();
};
