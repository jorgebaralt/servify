import React, { Component } from 'react';
import {
	Toast
} from 'native-base';
import { LinearGradient } from 'expo';
import {
	View,
	SafeAreaView,
	Keyboard,
	DeviceEventEmitter,
	Text,
	ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { Button, FloatingLabelInput } from '../../components/UI';
import { passwordReset } from '../../api';
import { colors } from '../../shared/styles';

let backPressSubscriptions;
let willFocusSubscription;

const initialState = {
	email: '',
	loading: false
};
class forgotPassword extends Component {
	state = initialState;

	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Forgot Password Screen');
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

	showToast = (text, type) => {
		Toast.show({
			text,
			duration: 2000,
			type
		});
		if (type === 'success') {
			this.clearState();
		}
	};

	resetPassword = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const { email } = this.state;
		await passwordReset(email, (text, type) => this.showToast(text, type));
	};

	clearState() {
		this.setState(initialState);
	}

	renderSpinner() {
		if (this.state.loading) {
			return <ActivityIndicator style={{ marginTop: 100 }} size="large" color={colors.white} />;
		}
		return <View />;
	}

	render() {
		const {
			backIconStyle,
			titleStyle
		} = styles;

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
							this.props.navigation.navigate('login');
						}}
					/>

					{/* Login Form */}
					<View style={{ flex: 1, paddingRight: 20, paddingLeft: 20 }}>
						<Text style={titleStyle}>Forgot Password</Text>
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
						{this.renderSpinner()}

							<Button
								bordered
								light
								style={{ marginTop: 40 }}
								onPress={() => this.resetPassword()}
							>
								<Text>Get reset link</Text>
							</Button>

					</View>
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
		fontSize: 30,
	}
};


export default forgotPassword;
