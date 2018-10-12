import axios from 'axios';
import { UPDATE_FAVORITE } from './types';

const getFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/getFavorite';
const addFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/addFavorite';
const removeFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/removeFavorite';

export const addFavorite = (email, service) => async () => {
	try {
		await axios.post(addFavURL, { email, service });
	} catch (e) {
		console.log(e);
	}
};
export const removeFavorite = (email, service) => async () => {
	try {
		await axios.post(removeFavURL, { email, service });
	} catch (e) {
		console.log(e);
	}
};

export const getFavorites = (email) => async (dispatch) => {
	try {
		const { data } = await axios.post(getFavURL, { email });
		dispatch({ type: UPDATE_FAVORITE, payload: data });
	} catch (e) {
		console.log(e);
	}
};
