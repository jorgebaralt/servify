import axios from 'axios';
import { Facebook } from 'expo';
import firebase from 'firebase';
import { FB_APP_ID } from '../config/keys';

const addUserDbURL = 'https://us-central1-servify-716c6.cloudfunctions.net/addUserdb';

// Facebook login
export const facebookLogin = async (callback) => {
	try {
		// Facebook permissions
		const { type, token } = await Facebook.logInWithReadPermissionsAsync(
			FB_APP_ID,
			{ permissions: ['public_profile', 'email'] }
		);
		
		// if permission denied
		if (type === 'cancel') {
			callback('Permission denied', 'error');
		}

		// firebase login with token from permission
		const credential = await firebase.auth.FacebookAuthProvider.credential(
			token
		);
		
		// get current logged in user from firebase
		const { user } = await firebase
			.auth()
			.signInAndRetrieveDataWithCredential(credential);
		
		// add user to firestore DB
		await axios.post(addUserDbURL, {
			userId: user.uid,
			email: user.email,
			displayName: user.displayName
		});

		// store user in redux
		callback(`Welcome ${user.displayName}`, 'success');

	} catch (e) {
		console.log(e);
	}
};

// email and password login
export const emailAndPasswordLogin = async (email, password, callback) => {
	try {
		const { user } = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);
		
		callback(`Welcome ${user.displayName}`, 'success');

	} catch (e) {
		console.log(e);
		callback('Incorrect information', 'warning');
	}
};
// create email account
export const createEmailAccount = async (newUser, callback) => {
	const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser';
	const { email, password, firstName, lastName } = newUser;
	// check not empty
	if (email && password && firstName && lastName) {
		if (password.length < 6) {
			callback('Password must be at least 6 characters long', 'warning');
		}
		// create the account
		try {
			await axios.post(url, {
				email,
				password,
				firstName,
				lastName
			});

			// Perform Login Using Firebase.
			const displayName = firstName + ' ' + lastName;
			await axios.post(addUserDbURL, { email, displayName });
			const { user } = await firebase
				.auth()
				.signInWithEmailAndPassword(email, password);
			await user.sendEmailVerification();
			callback(`Welcome ${user.displayName}`, 'success');
		} catch (e) {
			callback('Email already exist, or information is invalid', 'warning');
		}
	} else {
		callback('Please fill all information', 'warning');
	}
};

// reset password (forgot password)
export const passwordReset = async (email, callback) => {
	try {
		await firebase.auth().sendPasswordResetEmail(email);
		callback('Email with password reset link has been sent', 'success');
	} catch (e) {
		console.log(e);
		callback('Could not find email, please try again', 'warning');
	}
};

// Logout
export const logout = async () => {
	await firebase.auth().signOut();
};
