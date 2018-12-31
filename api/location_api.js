import { Location } from 'expo';

export const getLocationFromAddress = async (address) => {
	const geolocationData = await Location.geocodeAsync(address);
	const geolocation = geolocationData[0];
	return geolocation;
};
