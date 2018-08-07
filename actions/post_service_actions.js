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
		location,
		description,
		serviceTitle
    } = servicePost;

    const { email } = await firebase.auth().currentUser;

    if(selectedCategory && phone && location && description && serviceTitle){
        const category = selectedCategory.dbReference;
        let newServicePost;
        if(selectedCategory.subcategories && !selectedSubcategory){
            return dispatch({ type: POST_SERVICE_FAIL, payload: 'Please Fill Subcategories' });
        }
        // TODO: Handle location with location api from expo
        const locationData = await Location.geocodeAsync(location);
        console.log(locationData);

        if(selectedSubcategory){
            const subcategory = selectedSubcategory.dbReference;
            newServicePost = {
                category,
                subcategory,
                phone,
                description,
                serviceTitle,
                location,
                email
            };
        }else{
            newServicePost = {
                category,
                phone,
                description,
                serviceTitle,
                location,
                email
            };
        }
        try {
           await axios.post(url, newServicePost);
            return dispatch({ type: POST_SERVICE_SUCCESS, payload: 'Post has been created' });
        } catch (error) {
            return dispatch({ type: POST_SERVICE_FAIL, payload: 'Error connecting to server' });
        }
    }else{
        return dispatch({ type: POST_SERVICE_FAIL, payload: 'Please fill all the information' });
    }
};

export const resetMessagePost = () => async (dispatch) => {
    dispatch({ type: RESET_MESSAGE_POST });
};
