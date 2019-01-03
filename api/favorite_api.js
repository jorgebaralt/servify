import axios from 'axios';

const getFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/getFavorite';
const addFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/addFavorite';
const removeFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/removeFavorite';

export const addFavorite = async (email, service) => {
	try {
		await axios.post(addFavURL, { email, service });
	} catch (e) {
		console.log(e);
	}
};
export const removeFavorite = async (email, service) => {
	try {
		await axios.post(removeFavURL, { email, service });
	} catch (e) {
		console.log(e);
	}
};

export const getFavorites = async (email, callback) => {
	try {
		const { data } = await axios.post(getFavURL, { email });
		callback(data);
	} catch (e) {
		console.log(e);
	}
};