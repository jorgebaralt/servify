import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	DeviceEventEmitter,
	SafeAreaView,
	Image,
	Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';
import { facebookLogin } from '../../api/index';
import { Button } from '../../components/UI';
import LogoBorderWhite from '../../assets/logoBorderWhite.png';
import { pageHit } from '../../shared/ga_helper';

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
		pageHit('Auth Screen');
		willBlurSubscriptions = this.props.navigation.addListener(
			'willBlur',
			() => DeviceEventEmitter.removeAllListeners('hardwareBackPress')
		);
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscriptions.remove();
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
		await facebookLogin((text, type) => console.log(text, type));
	};

	render() {
		return (
			<LinearGradient
				colors={['#FF7043', '#F4511E', '#BF360C']}
				style={{ flex: 1 }}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={styles.authStyle}>
					<Image
						style={{ width: 82, height: 105, marginBottom: 20 }}
						source={LogoBorderWhite}
						resizeMode="cover"
					/>
					<Text style={styles.titleStyle}> Servify </Text>
					{/* log in with facebook */}
					<View style={styles.buttonStyle}>
						<Button bordered onPress={this.loginWithFacebook} style={{ fontSize: 18 }}>
							<MaterialCommunityIcons
								style={{
									color: 'white',
									fontSize: 20,
									marginRight: 10
								}}
								name="facebook-box"
							/>{' '}
							Log in with Facebook
						</Button>
					</View>
					{/* Create account with email */}
					<View style={styles.buttonStyle}>
						<Button
							bordered
							title="Servify"
							style={{ fontSize: 18 }}
							onPress={() => {
								this.props.navigation.navigate('createAccount');
							}}
						>
							Create account with Email
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
		marginTop: 20,
		fontSize: 30,
		color: 'white',
		fontWeight: 'bold'
	},
	authStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonStyle: {
		marginTop: 40
	},
	textStyle: {
		fontSize: 16
	}
};

export default AuthScreen;
