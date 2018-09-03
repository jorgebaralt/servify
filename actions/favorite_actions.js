import axios from 'axios';
import { UPDATE_FAVORITE } from './types';

const getFavURL = 'https://us-central1-servify-716c6.cloudfunctions.net/getFavorite';
const updateFavURL = 'https://us-central1-servify-716c6.cloudfunctions.net/updateFavorite';

export const updateFavorite = (email, favorites) => async (dispatch) => {
    try{
        await axios.post(updateFavURL, { email, favorites });
        const { data } = await axios.post(getFavURL, { email });

        dispatch({ type: UPDATE_FAVORITE, payload: data });
    } catch (e) {
        console.log(e);
    }
};

export const getFavorites = (email) => async (dispatch) => {
    try{
        const { data } = await axios.post(getFavURL, { email });
        dispatch({ type: UPDATE_FAVORITE, payload: data });
    } catch(e) {
        console.log(e);
    }
};
