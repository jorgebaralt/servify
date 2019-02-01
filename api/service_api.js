import axios from 'axios';
import _ from 'lodash';

const { CancelToken } = axios;
let source;
const serviceURL =	'https://us-central1-servify-716c6.cloudfunctions.net/service';
const servicesURL =	'https://us-central1-servify-716c6.cloudfunctions.net/services';

// Create a service
export const createService = async (servicePost, callback) => {
	try {
		// Everything is fine, publish the service
		const { data } = await axios.post(serviceURL, servicePost);
		return callback(data.message, data.type, data.service);
	} catch (error) {
		console.log(error);
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
	try {
		source = CancelToken.source();
		let { data } = await axios.get(servicesURL, {
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
	try {
		source = CancelToken.source();
		let { data } = await axios.get(servicesURL, {
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
export const getServicesCategory = async (category, userLocation, callback) => {
	try {
		source = CancelToken.source();
		let { data } = await axios.get(servicesURL, {
			params: {
				category
			},
			cancelToken: source.token
		});
		// sort services
		data = sortServices(data, 'Distance', userLocation);
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get services by subcategory
export const getServicesSubcategory = async (
	subcategory,
	userLocation,
	callback
) => {
	try {
		source = CancelToken.source();
		let { data } = await axios.get(servicesURL, {
			params: {
				subcategory
			},
			cancelToken: source.token
		});
		// sort services
		data = sortServices(data, 'Distance', userLocation);
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// Get services by email
export const getServicesByUid = async (uid, callback) => {
	try {
		source = CancelToken.source();
		const { data } = await axios.get(servicesURL, {
			params: {
				uid
			},
			cancelToken: source.token
		});
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// DELETE-SERVICE
export const deleteService = async (deletedService) => {
	try {
		await axios.delete(serviceURL, { data: { deletedService } });
	} catch (e) {
		console.log(e);
	}
};

// UPDATE-SERVICE
export const updateService = async (updatedService, serviceId, callback) => {
	try {
		await axios.put(serviceURL, { updatedService, serviceId });
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
	const reportUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/report';
	try {
		await axios.post(reportUrl, report);
	} catch (e) {
		console.log(e);
	}
};

// service sorting
export const sortServices = (data, sortBy, userLocation) => {
	let sortedData;
	switch (sortBy) {
		case 'Distance':
			sortedData = sortByDistance(data, userLocation);
			break;
		case 'Popularity':
			sortedData = sortByPopularity(data);
			break;
		case 'Newest':
			sortedData = sortByNewest(data);
			break;
		case 'Oldest':
			sortedData = sortByOldest(data);
			break;
		default:
			sortedData = sortByDistance(data, userLocation);
	}
	return sortedData;
};

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
