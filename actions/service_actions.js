import axios from 'axios';
import { Location } from 'expo';
import _ from 'lodash';
import {
	POST_SERVICE_SUCCESS,
	POST_SERVICE_FAIL,
	RESET_MESSAGE_POST,
	GET_SERVICES_FAIL,
	GET_SERVICES_SUCCESS,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	UPDATE_SERVICE_FAIL,
	UPDATE_SERVICE_SUCCESS,
	GET_NEAR_SERVICES_FAIL,
	GET_NEAR_SERVICES_SUCCESS,
	GET_POPULAR_CATEGORY_SUCCESS,
	GET_POPULAR_CATEGORY_FAIL,
	GET_POPULAR_SERVICES_SUCCESS,
	GET_POPULAR_SERVICES_FAIL,
	CLEAN_POPULAR_NEAR_SERVICES,
} from './types';

const GET_URL =	'https://us-central1-servify-716c6.cloudfunctions.net/getServices';
const { CancelToken } = axios;
let source;
// POST-SERVICE
export const createService = (servicePost, email) => async (dispatch) => {
	let isEmpty;
	const url =		'https://us-central1-servify-716c6.cloudfunctions.net/postService';
	const checkDuplicateBaseUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getServicesCount/';
	const {
		selectedCategory,
		selectedSubcategory,
		phone,
		zipCode,
		description,
		title,
		miles,
		displayName
	} = servicePost;

	const category = selectedCategory.dbReference;
	const geolocationData = await Location.geocodeAsync(zipCode);
	const geolocation = geolocationData[0];
	let locationData;
	try {
		const locationInfo = await Location.reverseGeocodeAsync({
			latitude: geolocation.latitude,
			longitude: geolocation.longitude
		});
		[locationData] = locationInfo;
		delete geolocation.accuracy;
		delete geolocation.altitude;
	} catch (e) {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload:
				'We could not find your address, please provide a correct address'
		});
	}

	const newServicePost = {
		category,
		phone,
		description,
		title,
		geolocation,
		locationData,
		miles,
		email,
		displayName,
		zipCode: locationData.postalCode
	};

	if (miles > 60) {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload:
				'No more than 60 miles for local services, we are working on services across states'
		});
	}

	// if there is subcategory option, and didnt pick one
	if (selectedCategory.subcategories && !selectedSubcategory) {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload: 'Please Fill Subcategory'
		});
	}

	// if there is subcategory, add it to the object
	if (selectedSubcategory) {
		newServicePost.subcategory = selectedSubcategory.dbReference;
		// check duplicate post by same user. under subcategory
		const checkURL =			checkDuplicateBaseUrl
			+ '/?email='
			+ email
			+ '&subcategory='
			+ selectedSubcategory.dbReference;
		try {
			const response = await axios.get(checkURL);
			isEmpty = response.data;
			if (!isEmpty) {
				return dispatch({
					type: POST_SERVICE_FAIL,
					payload:
						'This account already have a Service under this Subcategory, Only 1 service per subcategory is allowed'
				});
			}
		} catch (e) {
			return dispatch({
				type: POST_SERVICE_FAIL,
				payload: 'Error connecting to server'
			});
		}
	} else if (selectedCategory && !selectedSubcategory) {
		const checkURL =			checkDuplicateBaseUrl + '/?email=' + email + '&category=' + category;
		try {
			const response = await axios.get(checkURL);
			isEmpty = response.data;
			if (!isEmpty) {
				return dispatch({
					type: POST_SERVICE_FAIL,
					payload:
						'This account already have a Service under this category, Only 1 service per category is allowed'
				});
			}
		} catch (error) {
			return dispatch({
				type: POST_SERVICE_FAIL,
				payload: 'Error connecting to server'
			});
		}
	}

	try {
		await axios.post(url, newServicePost);
		return dispatch({
			type: POST_SERVICE_SUCCESS,
			payload: 'Post has been created'
		});
	} catch (error) {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload: 'Error connecting to server'
		});
	}
};

export const resetMessageService = () => async (dispatch) => {
	dispatch({ type: RESET_MESSAGE_POST });
};

// GET-SERVICE
export const getServicesCategory = (category, userLocation, sortBy) => async (
	dispatch
) => {
	const url = GET_URL + '/?category=' + category;
	try {
		source = CancelToken.source();
		let { data } = await axios.get(url, { cancelToken: source.token });
		// TODO: DECIDE SORTING
		switch (sortBy) {
			case 'Distance':
				data = sortByDistance(data, userLocation);
				break;
			case 'Popularity':
				data = sortByPopularity(data);
				break;
			case 'Newest':
				data = sortByNewest(data);
				break;
			case 'Oldest':
				data = sortByOldest(data);
				break;
			default:
				data = sortByDistance(data, userLocation);
		}
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		return dispatch({
			type: GET_SERVICES_FAIL,
			payload: 'Error... Check your connection'
		});
	}
};

export const getServicesSubcategory = (
	subcategory,
	userLocation,
	sortBy
) => async (dispatch) => {
	const url = GET_URL + '/?subcategory=' + subcategory;
	try {
		source = CancelToken.source();
		let { data } = await axios.get(url, { cancelToken: source.token });
		// TODO: DECIDE SORTING
		switch (sortBy) {
			case 'Distance':
				data = sortByDistance(data, userLocation);
				break;
			case 'Popularity':
				data = sortByPopularity(data);
				break;
			case 'Newest':
				data = sortByNewest(data);
				break;
			case 'Oldest':
				data = sortByOldest(data);
				break;
			default:
				data = sortByDistance(data, userLocation);
		}
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		return dispatch({ type: GET_SERVICES_FAIL });
	}
};

export const getServicesByEmail = (email) => async (dispatch) => {
	const url = GET_URL + '/?email=' + email;
	try {
		source = CancelToken.source();
		const { data } = await axios.get(url, { cancelToken: source.token });
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		console.log(e);
		return dispatch({ type: GET_SERVICES_FAIL });
	}
};

export const getServicesByZipcode = (currentLocation) => async (dispatch) => {
	let zipCode;
	try {
		const locationData = await Location.reverseGeocodeAsync({
			latitude: currentLocation.latitude,
			longitude: currentLocation.longitude
		});
		const [location] = locationData;
		zipCode = location.postalCode;
		const url = GET_URL + '?zipCode=' + zipCode;
		source = CancelToken.source();
		const { data } = await axios.get(url, { cancelToken: source.token });
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		console.log(e);
		return dispatch({ type: GET_SERVICES_FAIL });
	}
};

export const getNewNearServices = (currentLocation, distance) => async (
	dispatch
) => {
	const getNearUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getNearService';
	try {
		source = CancelToken.source();
		let { data } = await axios.post(
			getNearUrl,
			{
				currentLocation,
				distance
			},
			{ cancelToken: source.token }
		);
		data = _.sortBy(data, 'timestamp');
		data = data.reverse();
		data = data.slice(0, 5);
		return dispatch({ type: GET_NEAR_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		console.log(e);
		return dispatch({ type: GET_NEAR_SERVICES_FAIL });
	}
};

export const getPopularCategories = () => async (dispatch) => {
	const popularCategoryUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getPopularCategories';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(popularCategoryUrl, {
			cancelToken: source.token
		});
		dispatch({ type: GET_POPULAR_CATEGORY_SUCCESS, payload: data });
	} catch (e) {
		return dispatch({ type: GET_POPULAR_CATEGORY_FAIL });
	}
};

export const cleanPopularNearServices = () => (dispatch) => dispatch({ type: CLEAN_POPULAR_NEAR_SERVICES });

// Popular near Services
export const getPopularNearServices = (currentLocation, distance) => async (
	dispatch
) => {
	const getNearUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getNearService';
	try {
		source = CancelToken.source();
		let { data } = await axios.post(
			getNearUrl,
			{
				currentLocation,
				distance
			},
			{ cancelToken: source.token }
		);
		// sort near services by popularity
		data = sortByPopularity(data);
		// get the top 5
		data = data.slice(0, 5);
		dispatch({ type: GET_POPULAR_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		console.log(e);
		dispatch({ type: GET_POPULAR_SERVICES_FAIL });
	}
};

// DELETE-SERVICE
export const deleteService = (service) => async (dispatch) => {
	const deleteUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteService';
	try {
		await axios.delete(deleteUrl, { data: service });

		return dispatch({
			type: DELETE_SERVICE_SUCCESS,
			payload: 'Your service have been deleted'
		});
	} catch (e) {
		return dispatch({
			type: DELETE_SERVICE_FAIL,
			payload: 'Error deleting the service'
		});
	}
};

// UPDATE-SERVICE
export const updateService = (service) => async (dispatch) => {
	const updateUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/updateService';
	const newService = service;
	let locationData;
	try {
		const geolocationData = await Location.geocodeAsync(service.location);
		const geolocation = geolocationData[0];
		const locationInfo = await Location.reverseGeocodeAsync({
			latitude: geolocation.latitude,
			longitude: geolocation.longitude
		});
		[locationData] = locationInfo;

		delete geolocation.altitude;
		delete geolocation.accuracy;

		newService.locationData = locationData;
		newService.geolocation = geolocation;
		newService.zipCode = locationData.postalCode;
	} catch (e) {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload:
				'We could not find your address, please provide a correct address'
		});
	}
	try {
		await axios.post(updateUrl, newService);

		return dispatch({
			type: UPDATE_SERVICE_SUCCESS,
			payload: 'Your service has been updated'
		});
	} catch (e) {
		return dispatch({
			type: UPDATE_SERVICE_FAIL,
			payload: 'Error updating your service. Try later'
		});
	}
};

// REPORT-SERVICE
export const reportService = (report) => async (dispatch) => {
	const reportUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/reportService';
	try {
		await axios.post(reportUrl, report);
		dispatch({});
	} catch (e) {
		console.log(e);
	}
};

// Helper Functions

// sort array by distance
const sortByDistance = (data, userLocation) => {
	let newData = [];
	// for each service, calculate distance from user to service
	data.forEach((service) => {
		const newService = service;
		
		const distance = calculateDistance(
			userLocation.coords.latitude,
			userLocation.coords.longitude,
			newService.geolocation.latitude,
			newService.geolocation.longitude
		);
		// add a distance property to the service
		newService.distance = distance;
		newData.push(newService);
	});
	// sort services by distance
	newData = _.sortBy(newData, 'distance');
	return newData;
};

// calculate distance of 2 geopoints
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const radlat1 = (Math.PI * lat1) / 180;
	const radlat2 = (Math.PI * lat2) / 180;
	const theta = lon1 - lon2;
	const radtheta = (Math.PI * theta) / 180;
	let dist =		Math.sin(radlat1) * Math.sin(radlat2)
		+ Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515;
	return dist;
};

// sort by popularity
const sortByPopularity = (data) => {
	const newData = _.sortBy(data, (service) => [
		service.ratingCount,
		service.rating
	]);
	return newData.reverse();
};

// sort by oldest
const sortByOldest = (data) => _.sortBy(data, 'timestamp');

// sort by newest
const sortByNewest = (data) => _.sortBy(data, 'timestamp').reverse();

// Cancel Axios calls
export const cancelAxiosServices = () => async (dispatch) => {
	await source.cancel('Fetched cancelled by user');
};
