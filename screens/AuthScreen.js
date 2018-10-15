import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	DeviceEventEmitter,
	BackHandler,
	SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Text, Icon } from 'native-base';
import { LinearGradient } from 'expo';
import { facebookLogin } from '../actions';

let backPressSubscriptions;
let willFocusSubscription;
let willBlurSubscriptions;
class AuthScreen extends Component {
	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		willBlurSubscriptions = this.props.navigation.addListener('willBlur', () => DeviceEventEmitter.removeAllListeners('hardwareBackPress'));
	}

	componentWillUpdate(nextProps) {
		this.onAuthComplete(nextProps);
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscriptions.remove();
	}

	async onAuthComplete(props) {
		if (props.displayName) {
			await this.props.navigation.navigate('home');
		}
	}

	handleAndroidBack = () => {
		backPressSubscriptions = new Set();
		DeviceEventEmitter.removeAllListeners('hardwareBackPress');
		DeviceEventEmitter.addListener('hardwareBackPress', () => {
			const subscriptions = [];

			backPressSubscriptions.forEach((sub) => subscriptions.push(sub));
			for (let i = 0; i < subscriptions.reverse().length; i += 1) {
				if (subscriptions[i]()) {
					break;
				}
			}
		});
		backPressSubscriptions.add(() => this.props.navigation.navigate('welcome'));
	};

	loginWithFacebook = async () => {
		await this.props.facebookLogin();
		this.onAuthComplete(this.props);
	};

	render() {
		return (
			<LinearGradient
				colors={['#FF7043', '#F4511E', '#BF360C']}
				style={{ flex: 1 }}
			>
				<SafeAreaView style={styles.authStyle}>
					<Text style={styles.titleStyle}> Servify </Text>
					{/* //log in with facebook */}
					<View style={styles.buttonStyle}>
						<Button
							bordered
							light
							title="Facebook"
							onPress={this.loginWithFacebook}
						>
							<Text style={styles.textStyle}>
								<Icon
									style={{
										color: 'white',
										fontSize: 16,
										marginRight: 10
									}}
									type="Entypo"
									name="facebook"
								/>{' '}
								Log in with Facebook
							</Text>
						</Button>
					</View>
					{/* //Create account with email */}
					<View style={styles.buttonStyle}>
						<Button
							bordered
							light
							title="Servify"
							onPress={() => {
								this.props.navigation.navigate('createAccount');
							}}
						>
							<Text style={styles.textStyle}>Create account with Email</Text>
						</Button>
					</View>
					{/* // go to login screen */}
					<TouchableOpacity
						style={{ position: 'absolute', bottom: 40, right: 20 }}
					>
						<Text
							style={{ fontSize: 16, color: 'white' }}
							onPress={() => {
								this.props.navigation.navigate('login');
							}}
						>
							Login
						</Text>
					</TouchableOpacity>
					{/* //go to welcome screen (tutorial) */}
					<TouchableOpacity
						style={{ position: 'absolute', bottom: 40, left: 20 }}
					>
						<Text
							style={{ fontSize: 16, color: 'white' }}
							onPress={() => {
								this.props.navigation.navigate('welcome');
							}}
						>
							Tutorial
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</LinearGradient>
		);
	}
}

const styles = {
	titleStyle: {
		fontSize: 40,
		color: 'white',
		marginBottom: 100,
		fontWeight: 'bold'
	},
	authStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonStyle: {
		marginBottom: 30
	},
	textStyle: {
		fontSize: 16
	}
};

function mapStateToProps(state) {
	return { displayName: state.auth.displayName };
}

export default connect(
	mapStateToProps,
	{ facebookLogin }
)(AuthScreen);
