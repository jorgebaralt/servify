import axios from 'axios';
import { Location } from 'expo';
import _ from 'lodash';

const { CancelToken } = axios;
let source;
const GET_URL =	'https://us-central1-servify-716c6.cloudfunctions.net/getServices';

// Create a service
export const createService = async (servicePost, user, callback) => {
	let isEmpty;
	const createServiceURL =		'https://us-central1-servify-716c6.cloudfunctions.net/postService';
	const checkDuplicateBaseUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getServicesCount/';
	const {
		selectedCategory,
		selectedSubcategory,
		phone,
		location,
		description,
		title,
		miles,
		imagesInfo,
		isDelivery,
		physicalLocation
	} = servicePost;

	if (miles > 60) {
		return callback(
			'No more than 60 miles for local services, we are working on services across states',
			'warning'
		);
	}

	// Get geoLocation based on location data
	const geolocationData = await Location.geocodeAsync(location);
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
		console.log(e);
		callback(
			'We could not find your address, please provide a correct address',
			'warning'
		);
	}

	// service to be posted, if everything is fine
	// the rest data (ratings, location(geopoints) is set on backend)
	const category = selectedCategory.dbReference;
	const newServicePost = {
		category,
		phone,
		description,
		title,
		geolocation,
		locationData,
		miles,
		email: user.email,
		displayName: user.displayName,
		uid: user.uid,
		zipCode: locationData.postalCode,
		imagesInfo,
		isDelivery,
		physicalLocation
	};

	// if there is subcategory option, and didnt pick one
	if (selectedCategory.subcategories && !selectedSubcategory) {
		return callback('Please Fill Subcategory', 'warning');
	}

	// if there is a subcategory selected, add it to the object
	if (selectedSubcategory) {
		newServicePost.subcategory = selectedSubcategory.dbReference;
		// Check duplicate service using subcategory
		try {
			const response = await axios.get(checkDuplicateBaseUrl, {
				params: {
					email: user.email,
					subcategory: selectedSubcategory.dbReference
				}
			});
			isEmpty = response.data;
			if (!isEmpty) {
				return callback(
					'This account already have a Service under this Subcategory, Only 1 service per subcategory is allowed',
					'warning'
				);
			}
		} catch (e) {
			console.log('error checking duplicate for subcategory');
			return callback('Error connecting to server', 'warning');
		}
	} else {
		// Check duplicate using category
		try {
			const response = await axios.get(checkDuplicateBaseUrl, { params: { email: user.email, category } });
			isEmpty = response.data;
			if (!isEmpty) {
				return callback(
					'This account already have a Service under this category, Only 1 service per category is allowed',
					'warning'
				);
			}
		} catch (error) {
			console.log('error checking duplicate for category');
			return callback('Error connecting to server', 'warning');
		}
	}
	try {
		// Everything is fine, publish the service
		await axios.post(createServiceURL, newServicePost);
		return callback('Service has been published', 'success');
	} catch (error) {
		return callback('Error connecting to server', 'warning');
	}
};

// Get popular categories
export const getPopularCategories = async (callback) => {
	const popularCategoryUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getPopularCategories';
	try {
		source = CancelToken.source();
		const { data } = await axios.get(popularCategoryUrl, {
			cancelToken: source.token
		});
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// Get popular near services
export const getPopularNearServices = async (
	currentLocation,
	distance,
	callback
) => {
	const getNearUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getNearService';
	try {
		source = CancelToken.source();
		let { data } = await axios.get(getNearUrl, {
			params: {
				currentLocation,
				distance
			},
			cancelToken: source.token
		});
		// sort near services by popularity
		data = sortByPopularity(data);
		// get the top 5
		data = data.slice(0, 5);
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get new near services
export const getNewNearServices = async (
	currentLocation,
	distance,
	callback
) => {
	const getNearUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/getNearService';
	try {
		source = CancelToken.source();
		let { data } = await axios.get(getNearUrl, {
			params: {
				currentLocation,
				distance
			},
			cancelToken: source.token
		});
		data = _.sortBy(data, 'timestamp');
		data = data.reverse();
		data = data.slice(0, 5);
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// Get service by category
export const getServicesCategory = async (
	category,
	userLocation,
	sortBy,
	callback
) => {
	try {
		source = CancelToken.source();
		let { data } = await axios.get(GET_URL, {
			params: {
				category
			},
			cancelToken: source.token
		});
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
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get services by subcategory
export const getServicesSubcategory = async (
	subcategory,
	userLocation,
	sortBy,
	callback
) => {
	try {
		source = CancelToken.source();
		let { data } = await axios.get(GET_URL, {
			params: {
				subcategory
			},
			cancelToken: source.token
		});
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
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// Get services by email
export const getServicesByEmail = async (email, callback) => {
	try {
		source = CancelToken.source();
		const { data } = await axios.get(GET_URL, {
			params: {
				email
			},
			cancelToken: source.token
		});
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// DELETE-SERVICE
export const deleteService = async (service) => {
	const deleteUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/deleteService';
	try {
		await axios.delete(deleteUrl, { data: service });
	} catch (e) {
		console.log(e);
	}
};

// UPDATE-SERVICE
export const updateService = async (service, serviceId, callback) => {
	const updateUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/updateService';
	const updatedService = service;
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

		updatedService.locationData = locationData;
		updatedService.geolocation = geolocation;
		updatedService.zipCode = locationData.postalCode;
	} catch (e) {
		callback(
			'We could not find your address, please provide a correct address',
			'warning'
		);
	}
	try {
		await axios.post(updateUrl, { updatedService, serviceId });
		callback(
			'Service hace been updated, Allow a few minutess for changes to display',
			'success'
		);
	} catch (e) {
		console.log(e);
		callback('error updating your service, Try again later', 'warning');
	}
};

// REPORT-SERVICE
export const reportService = async (report) => {
	const reportUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/reportService';
	try {
		await axios.post(reportUrl, report);
	} catch (e) {
		console.log(e);
	}
};

// sort array by distance
// TODO: handle better on back end.
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
		// add a distance property to the service so we can compare
		newService.distance = distance;
		newData.push(newService);
	});
	// sort services by distances
	newData = _.sortBy(newData, 'distance');
	return newData;
};

// calculate distance between of 2 geopoints
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

export const cancelAxios = async () => {
	await source.cancel();
};
