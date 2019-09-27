import * as Location from 'expo-location';

export const getLocationFromAddress = async (address) => {
	const geolocationData = await Location.geocodeAsync(address);
	const geolocation = geolocationData[0];
	return geolocation;
};

export const getLocationInfo = async (coords) => {
	const locationInfo = await Location.reverseGeocodeAsync({
		latitude: coords.latitude,
		longitude: coords.longitude
	});
	return locationInfo[0];
};
