import React, { Component } from 'react';
import { Toast } from 'native-base';
import { LinearGradient } from 'expo';
import {
	View,
	SafeAreaView,
	Keyboard,
	DeviceEventEmitter,
	TouchableOpacity,
	ActivityIndicator,
	Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { emailAndPasswordLogin, resetMessage } from '../../actions';
import { pageHit } from '../../shared/ga_helper';
import { FloatingLabelInput, Button } from '../../components/UI';
import { colors } from '../../shared/styles';

let backPressSubscriptions;
let willFocusSubscription;

const initialState = {
	email: '',
	password: '',
	showToast: false,
	loading: false
};
class LoginScreen extends Component {
	state = initialState;

	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Login Screen');
	}

	componentWillUpdate(nextProps) {
		const { displayName, message } = nextProps;
		if (displayName) {
			this.props.navigation.navigate('main');
			Toast.show({
				text: 'Welcome ' + displayName,
				duration: 2000,
				type: 'success'
			});
		}
		if (message) {
			Toast.show({
				text: message,
				buttonText: 'Okay',
				duration: 5000,
				type: 'warning'
			});
		}
		this.props.resetMessage();
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
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
		backPressSubscriptions.add(() => this.props.navigation.navigate('auth'));
	};

	loginUser = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const { email, password } = this.state;
		await this.props.emailAndPasswordLogin(email, password);
		this.clearState();
	};

	clearState() {
		this.setState(initialState);
	}

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 100 }}
					size="large"
					color={colors.white}
				/>
			);
		}
		return <View />;
	}

	render() {
		const { backIconStyle, titleStyle } = styles;

		return (
			<LinearGradient
				colors={['#FF7043', '#F4511E', '#BF360C']}
				style={{ flex: 1 }}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<Ionicons
						style={backIconStyle}
						name="ios-arrow-back"
						size={40}
						onPress={() => {
							this.props.navigation.navigate('auth');
						}}
					/>

					{/* Login Form */}
					<View
						style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
					>
						<Text style={titleStyle}>Sign in</Text>

						<FloatingLabelInput
							value={this.state.email}
							label="Email"
							firstColor={colors.white}
							secondColor={colors.white}
							onChangeText={(email) => {
								this.setState({ email });
							}}
							autoCapitalize="none"
							style={{ marginTop: 20 }}
						/>

						<FloatingLabelInput
							value={this.state.password}
							label="Password"
							firstColor={colors.white}
							secondColor={colors.white}
							onChangeText={(password) => {
								this.setState({ password });
							}}
							secureTextEntry
							style={{ marginTop: 20 }}
						/>

						<Button
							title="Login User"
							bordered
							style={{ marginTop: 40 }}
							onPress={this.loginUser}
						>
							Log in
						</Button>

						{this.renderSpinner()}
					</View>
					<TouchableOpacity
						style={{ position: 'absolute', bottom: 40, right: 20 }}
					>
						<Text
							style={{ fontSize: 16, color: 'white' }}
							onPress={() => {
								this.props.navigation.navigate(
									'forgotPassword'
								);
							}}
						>
							Forgot password
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</LinearGradient>
		);
	}
}

const styles = {
	backIconStyle: {
		color: 'white',
		top: 10,
		left: 5,
		marginBottom: 40
	},
	titleStyle: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 30
	}
};

function mapStateToProps(state) {
	return {
		displayName: state.auth.displayName,
		message: state.auth.message
	};
}

export default connect(
	mapStateToProps,
	{ emailAndPasswordLogin, resetMessage }
)(LoginScreen);
