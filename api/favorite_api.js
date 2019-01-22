import axios from 'axios';

const favoritesURL = 'https://us-central1-servify-716c6.cloudfunctions.net/favorites';
const { CancelToken } = axios;
let source;

export const addFavorite = async (uid, serviceId) => {
	try {
		await axios.post(favoritesURL, { uid, serviceId });
	} catch (e) {
		console.log(e);
	}
};
export const removeFavorite = async (uid, serviceId) => {
	try {
		await axios.delete(favoritesURL, { data: { uid, serviceId } });
	} catch (e) {
		console.log(e);
	}
};

export const getFavorites = async (uid, callback) => {
	try {
		source = CancelToken.source();
		const { data } = await axios.get(favoritesURL, {
			params: { uid },
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
