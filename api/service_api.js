import axios from 'axios';
import _ from 'lodash';

const { CancelToken } = axios;
let source;
// Get popular categories 
export const getPopularCategories = async (callback) => {
	const popularCategoryUrl =	'https://us-central1-servify-716c6.cloudfunctions.net/getPopularCategories';
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
export const getPopularNearServices = async (currentLocation, distance, callback) => {
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
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

// get new near services
export const getNewNearServices = async (currentLocation, distance, callback) => {
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
		callback(data);
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
