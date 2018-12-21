import React, { Component } from 'react';
import { AppLoading } from 'expo';
import { View, UIManager, Platform } from 'react-native';
import _ from 'lodash';
import firebase from 'firebase';
import { connect } from 'react-redux';
import Slides from '../../components/UI/Slides/Slides';
import { getFavorites, getEmail } from '../../actions';
import { pageHit } from '../../shared/ga_helper';

const SLIDE_DATA = [
	{ text: 'Welcome to Servify', color: '#FFA000' },
	{ text: 'Easy way to Find a Service around your Area', color: '#00B8D4' },
	{
		text: 'Post or Find Help from any Professional Registered',
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

	componentDidMount() {
		// ga hit
		pageHit('Welcome Screen');
	}

	onSlidesComplete = () => {
		this.props.navigation.navigate('auth');
	};

	async checkForUser() {
		// check for logged in user
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				await this.props.getEmail();
				if (this.props.email) {
					this.props.getFavorites(this.props.email);
				}
				// navigate to main if already logged in
				this.props.navigation.navigate('main');
				this.setState({ authenticated: true });
			} else {
				// No user is signed in.
				this.setState({ authenticated: false });
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
function mapStateToProps(state) {
	return {
		email: state.auth.email
	};
}

export default connect(
	mapStateToProps,
	{ getFavorites, getEmail }
)(WelcomeScreen);