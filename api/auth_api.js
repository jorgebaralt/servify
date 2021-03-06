import axios from 'axios';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
// import * as GoogleSignIn from 'expo-google-sign-in';

import firebase from 'firebase';
import {
	FB_APP_ID,
	iosClientIdGoogle,
	androidClientIdGoogle
} from '../config/keys';

const userURL = 'https://us-central1-servify-716c6.cloudfunctions.net/user';
const authURL = 'https://us-central1-servify-716c6.cloudfunctions.net/auth';

// Google login
export const googleLogin = async (callback) => {
	try {
		const result = await Google.logInAsync({
			androidClientId: androidClientIdGoogle,
			iosClientId: iosClientIdGoogle,
			androidStandaloneAppClientId: androidClientIdGoogle,
			iosStandaloneAppClientId: iosClientIdGoogle,
			scopes: ['profile', 'email'],
			behavior: 'web'
			// clientId: '737506787644-vhmrpn1ejikv8mcstqmol81l26gnudev.apps.googleusercontent.com'
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
			await axios.post(userURL, {
				user: {
					email: user.email,
					displayName: user.displayName,
					uid: user.uid,
					emailVerified: user.emailVerified,
					photoURL: user.providerData[0].photoURL,
					provider: user.providerData[0].providerId,
					imageInfo: null
				}
			});
			callback(`Welcome ${user.displayName}`, 'success');
		} else {
			callback('Permission denied', 'warning');
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
			callback('Permission denied', 'warning');
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
		await axios.post(userURL, {
			user: {
				email: user.email,
				displayName: user.displayName,
				uid: user.uid,
				emailVerified: user.emailVerified,
				photoURL: user.providerData[0].photoURL,
				provider: user.providerData[0].providerId,
				imageInfo: null
			}
		});
		// await user.sendEmailVerification();
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
	const { email, password, imageInfo, username } = newUser;
	// check not empty
	if (email && password) {
		if (password.length < 6) {
			return callback(
				'Password must be at least 6 characters long',
				'warning'
			);
		}
		if (!email.includes('@')) {
			return callback('Email is bad formatted', 'warning');
		}
		// create the account on authentication
		try {
			const { data } = await axios.post(authURL, {
				email,
				password,
				displayName: username,
				photoURL: imageInfo ? imageInfo.url : null
			});
			// new user object to be added to DB
			const createdUser = {
				email: data.email,
				displayName: username,
				uid: data.uid,
				emailVerified: data.emailVerified,
				imageInfo,
				provider: data.providerData[0].providerId,
				photoURL: imageInfo ? imageInfo.url : null
			};
			// ass user to DB
			await axios.post(userURL, { user: createdUser });
			// Perform Login Using Firebase.
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
