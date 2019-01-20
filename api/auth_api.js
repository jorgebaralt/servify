import axios from 'axios';
import { Facebook, Google } from 'expo';
import firebase from 'firebase';
import { FB_APP_ID, iosClientIdGoogle, androidClientIdGoogle } from '../config/keys';

const addUserDbURL =	'https://us-central1-servify-716c6.cloudfunctions.net/addUserdb';

// Google login
export const googleLogin = async (callback) => {
	try {
		const result = await Google.logInAsync({
			androidClientId: androidClientIdGoogle,
			iosClientId: iosClientIdGoogle,
			scopes: ['profile', 'email'],
			behavior: 'web'
		});

		if (result.type === 'success') {
			// sign in with credentials

			const credential = await firebase.auth.GoogleAuthProvider.credential(
				result.idToken,
				result.accessToken
			);
			// get current logged in user from firebase
			const {
				user
			} = await firebase
				.auth()
				.signInAndRetrieveDataWithCredential(credential);

			// add user to firestore DB
			await axios.post(addUserDbURL, {
				email: user.email,
				displayName: user.displayName,
				uid: user.uid,
				emailVerified: user.emailVerified,
				photoURL: user.providerData[0].photoURL,
				provider: user.providerData[0].providerId
			});
		} else {
			console.log('canceled');
		}
	} catch (e) {
		return { error: true };
	}
};

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
		const {
			user
		} = await firebase
			.auth()
			.signInAndRetrieveDataWithCredential(credential);

		// add user to firestore DB
		await axios.post(addUserDbURL, {
			email: user.email,
			displayName: user.displayName,
			uid: user.uid,
			emailVerified: user.emailVerified,
			photoURL: user.providerData[0].photoURL,
			provider: user.providerData[0].providerId
		});
		await user.sendEmailVerification();
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
	const createUserUrl =		'https://us-central1-servify-716c6.cloudfunctions.net/createUser';
	const { email, password, firstName, lastName, imageInfo } = newUser;
	console.log(imageInfo);
	// check not empty
	if (email && password && firstName && lastName) {
		if (password.length < 6) {
			return callback('Password must be at least 6 characters long', 'warning');
		}
		if (!email.includes('@')) {
			return callback('Email is bad formatted', 'warning');
		}
		// create the account
		try {
			const { data } = await axios.post(createUserUrl, {
				email,
				password,
				firstName,
				lastName,
			});
			// Perform Login Using Firebase.
			await axios.post(addUserDbURL, {
				email: data.email,
				displayName: data.displayName,
				uid: data.uid,
				emailVerified: data.emailVerified,
				imageInfo,
				provider: data.providerData[0].providerId
			});
			const { user } = await firebase
				.auth()
				.signInWithEmailAndPassword(email, password);
			await user.sendEmailVerification();
			callback(`Welcome ${user.displayName}`, 'success');
		} catch (e) {
			callback(
				'Email already exist, or information is invalid',
				'warning'
			);
			console.log(e);
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
