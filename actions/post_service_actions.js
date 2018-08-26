import axios from 'axios';
import firebase from 'firebase';
import { Location } from 'expo';
import { POST_SERVICE_SUCCESS, POST_SERVICE_FAIL, RESET_MESSAGE_POST } from './types';

export const createService = (servicePost) => async (dispatch) => {
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/postService';
	const {
		selectedCategory,
		selectedSubcategory,
		phone,
		zipCode,
		description,
        title,
        miles
    } = servicePost;

    const { email } = await firebase.auth().currentUser;

    if (selectedCategory && phone && zipCode && description && title) {
        const category = selectedCategory.dbReference;
        const geolocationData = await Location.geocodeAsync(zipCode);
        const geolocation = geolocationData[0];
        const locationData = await Location.reverseGeocodeAsync({ latitude: geolocation.latitude, longitude: geolocation.longitude });
        const location = locationData[0];

        const newServicePost = {
            category,
            phone,
            description,
            title,
            zipCode,
            geolocation,
            location,
            miles,
            email
        };

        // if there is subcategory option, and didnt pick one
        if(selectedCategory.subcategories && !selectedSubcategory){
            return dispatch({ type: POST_SERVICE_FAIL, payload: 'Please Fill Subcategory' });
        }

        // if there is subcategory, add it to the object
        if(selectedSubcategory){
            newServicePost.subcategory = selectedSubcategory.dbReference;
        }

        // TODO: check if the user, has a post in the category && subcategory already, unless it is other.

        try {
            await axios.post(url, newServicePost);
            return dispatch({ type: POST_SERVICE_SUCCESS, payload: 'Post has been created' });
        } catch (error) {
            return dispatch({ type: POST_SERVICE_FAIL, payload: 'Error connecting to server' });
        }
    } else {
        return dispatch({ type: POST_SERVICE_FAIL, payload: 'Please fill all the information' });
    }
};

export const resetMessagePost = () => async (dispatch) => {
    dispatch({ type: RESET_MESSAGE_POST });
};
