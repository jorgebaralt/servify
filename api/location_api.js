import { Location } from 'expo';

export const getLocationFromAddress = async (address) => {
	const geolocationData = await Location.geocodeAsync(address);
	const geolocation = geolocationData[0];
	return geolocation;
};

export const getLocationInfo = async (coords, callback) => {
	const locationInfo = await Location.reverseGeocodeAsync({
		latitude: coords.latitude,
		longitude: coords.longitude
	});
	callback(locationInfo[0]);
};
