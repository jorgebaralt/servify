import * as Location from 'expo-location';
import { GET_USER_LOCATION_SUCCESS } from './types';

export const getUserLocation = () => async (dispatch) => {
	try {
		const location = await Location.getCurrentPositionAsync({
			// false for faster load
			accuracy: Location.Accuracy.High
		});
		dispatch({ type: GET_USER_LOCATION_SUCCESS, payload: location });
	} catch (e) {
		console.log(e);
	}
};
