import axios from 'axios';
import firebase from 'firebase';
import { Location } from 'expo';
import { 
    POST_SERVICE_SUCCESS, 
    POST_SERVICE_FAIL, 
    RESET_MESSAGE_POST 
} from './types';

export const createService = (servicePost, email) => async (dispatch) => {
    let isEmpty;
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/postService';
    const countBaseURL = 'https://us-central1-servify-716c6.cloudfunctions.net/getServicesCount/';
	const {
		selectedCategory,
		selectedSubcategory,
		phone,
		zipCode,
		description,
        title,
        miles,
        displayName
    } = servicePost;

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
            email,
            displayName
        };

        // if there is subcategory option, and didnt pick one
        if(selectedCategory.subcategories && !selectedSubcategory){
            return dispatch({ type: POST_SERVICE_FAIL, payload: 'Please Fill Subcategory' });
        }

        // if there is subcategory, add it to the object
        if (selectedSubcategory) {
            newServicePost.subcategory = selectedSubcategory.dbReference;
            // check duplicate post by same user. under subcategory
            const countURL = countBaseURL + '/?email=' + email + '&subcategory=' + selectedSubcategory.dbReference;
            try {
                const response = await axios.get(countURL);
                isEmpty = response.data;
                if (!isEmpty) {
                    return dispatch({ type: POST_SERVICE_FAIL, payload: 'This email already have a Service under this Subcategory, Only 1 service per subcategory is allowed' });
                }
            } catch (e) {
                return dispatch({ type: POST_SERVICE_FAIL, payload: 'Error connecting to server' });
            }
        } else if (selectedCategory && !selectedSubcategory) { 
            const countURL = countBaseURL + '/?email=' + email + '&category=' + category;
            try {
                const response = await axios.get(countURL);
                isEmpty = response.data;
                if (!isEmpty) {
                    return dispatch({ type: POST_SERVICE_FAIL, payload: 'This email already have a Service under this category, Only 1 service per category is allowed' });
                }
            } catch (error) {
                return dispatch({ type: POST_SERVICE_FAIL, payload: 'Error connecting to server' });
            }
        }
      
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
