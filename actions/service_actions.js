import axios from 'axios';
import { Location } from 'expo';
import {
	POST_SERVICE_SUCCESS,
	POST_SERVICE_FAIL,
	RESET_MESSAGE_POST,
	GET_SERVICES_FAIL,
	GET_SERVICES_SUCCESS,
	DELETE_SERVICE_SUCCESS,
	DELETE_SERVICE_FAIL,
	UPDATE_SERVICE_FAIL,
	UPDATE_SERVICE_SUCCESS
} from './types';

const GET_URL =	'https://us-central1-servify-716c6.cloudfunctions.net/getServices';

// POST-SERVICE
export const createService = (servicePost, email) => async (dispatch) => {
	let isEmpty;
	const url =	'https://us-central1-servify-716c6.cloudfunctions.net/postService';
	const checkDuplicateBaseUrl = 'https://us-central1-servify-716c6.cloudfunctions.net/getServicesCount/';
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

	if (selectedCategory && phone && zipCode && description && title) {
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
			const checkURL =				checkDuplicateBaseUrl
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
							'This email already have a Service under this Subcategory, Only 1 service per subcategory is allowed'
					});
				}
			} catch (e) {
				return dispatch({
					type: POST_SERVICE_FAIL,
					payload: 'Error connecting to server'
				});
			}
		} else if (selectedCategory && !selectedSubcategory) {
			const checkURL =				checkDuplicateBaseUrl + '/?email=' + email + '&category=' + category;
			try {
				const response = await axios.get(checkURL);
				isEmpty = response.data;
				if (!isEmpty) {
					return dispatch({
						type: POST_SERVICE_FAIL,
						payload:
							'This email already have a Service under this category, Only 1 service per category is allowed'
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
	} else {
		return dispatch({
			type: POST_SERVICE_FAIL,
			payload: 'Please fill all the information'
		});
	}
};

export const resetMessageService = () => async (dispatch) => {
	dispatch({ type: RESET_MESSAGE_POST });
};

// GET-SERVICE
export const getServicesCategory = (category) => async (dispatch) => {
	const url = GET_URL + '/?category=' + category;
	try {
		const { data } = await axios.get(url);
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		return dispatch({
			type: GET_SERVICES_FAIL,
			payload: 'Error... Check your connection'
		});
	}
};

export const getServicesSubcategory = (category, subcategory) => async (
	dispatch
) => {
	const url = GET_URL + '/?subcategory=' + subcategory;
	try {
		const { data } = await axios.get(url);
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		return dispatch({ type: GET_SERVICES_FAIL });
	}
};

export const getServicesByEmail = (email) => async (dispatch) => {
	const url = GET_URL + '/?email=' + email;
	try {
		// TODO: change here
		const { data } = await axios.get(url);
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
		const { data } = await axios.get(url);
		return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
	} catch (e) {
		console.log(e);
		return dispatch({ type: GET_SERVICES_FAIL });
	}
};

export const getNearServices = (currentLocation, distance) => async (dispatch) => {
	console.log(currentLocation);
	console.log(distance);

	// 1 mile of lat and log in degrees
	let lat = 0.0144927536231884;
	let lon = 0.0181818181818182;

	let lowerLat = currentLocation.latitude - (lat * distance);
	let lowerLon = currentLocation.longitude - (lon * distance);

	let greaterLat = currentLocation.latitude + (lat * distance);
	let greaterLon = currentLocation.longitude + (lon * distance);


};

// DELETE-SERVICE
export const deleteService = (service) => async (dispatch) => {
	const deleteUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteService/?email='
		+ service.email;
	let url;
	if (service.subcategory) {
		url = deleteUrl + '&subcategory=' + service.subcategory;
	} else {
		url = deleteUrl + '&category=' + service.category;
	}
	try {
		await axios.delete(url);
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
