import React, { Component } from 'react';
import { AppLoading } from 'expo';
import { View, UIManager, Platform, AsyncStorage } from 'react-native';
import _ from 'lodash';
import firebase from 'firebase';
import { connect } from 'react-redux';
import Slides from '../../components/UI/Slides/Slides';
import { getCurrentUser } from '../../actions';
import { pageHit } from '../../shared/ga_helper';

const SLIDE_DATA = [
	{ text: 'Welcome to Servify', color: '#FFA000' },
	{ text: 'Easy way to Find a Service around your Area', color: '#00B8D4' },
	{
		text: 'Publish or Find Help from any Professional Registered',
		color: '#7E57C2'
	}
];

class WelcomeScreen extends Component {
	state = {
		authenticated: null
	};

	async componentWillMount() {
		// Automatically animates views to their new positions when the next layout happens.
		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
		// check if there is a user logged in already
		await this.checkForUser();
	}


	async componentDidMount() {
		// ga hit
		pageHit('Welcome Screen');
	}

	onSlidesComplete = async () => {
		try {
			await AsyncStorage.setItem('seenTutorial', 'seen');
		} catch (e) {
			console.log(e);
		}
		
		this.props.navigation.navigate('auth');
	};

	async checkForUser() {
		// Listen for user loggin change
		await firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				await this.props.getCurrentUser();
				// navigate to main if already logged in
				this.props.navigation.navigate('home');
				this.setState({ authenticated: true });
			} else {
				// No user is signed in.
				this.setState({ authenticated: false });
				// check if user already went through tutorial
				const seenTutorial = await AsyncStorage.getItem('seenTutorial');
				if (seenTutorial === 'seen') {
					this.props.navigation.navigate('auth');
				} else {
					this.props.navigation.navigate('welcome');
				}
				
			}
		});
	}

	render() {
		// if we are still loading font or we have not checked for token
		if (_.isNull(this.state.authenticated)) {
			return <AppLoading />;
		}
		// show app tutorial
		return (
			<View style={{ flex: 1 }}>
				<Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete} />
			</View>
		);
	}
}

export default connect(
	null,
	{ getCurrentUser }
)(WelcomeScreen);
