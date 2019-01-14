import axios from 'axios';

const getFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/getFavorite';
const addFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/addFavorite';
const removeFavURL =	'https://us-central1-servify-716c6.cloudfunctions.net/removeFavorite';

const { CancelToken } = axios;
let source;

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
		source = CancelToken.source();
		const { data } = await axios.get(getFavURL, {
			params: { email },
			cancelToken: source.token
		});
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export const cancelAxiosFavs = async () => {
	await source.cancel();
};
