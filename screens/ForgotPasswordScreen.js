import React, { Component } from 'react';
import {
	Icon,
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
import { connect } from 'react-redux';
import { resetMessage, passwordReset } from '../actions';
import { pageHit } from '../shared/ga_helper';
import { Button, FloatingLabelInput } from '../components/UI';
import { colors } from '../shared/styles';

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

	componentWillUpdate(nextProps) {
		const { passwordMessage, passwordMessageFail } = nextProps;

		if (passwordMessage) {
			Toast.show({
				text: passwordMessage,
				buttonText: 'Okay',
				duration: 5000,
				type: 'success'
			});
		}
		if (passwordMessageFail) {
			Toast.show({
				text: passwordMessageFail,
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

	resetPassword = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const { email } = this.state;
		await this.props.passwordReset(email);
		this.clearState();
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
					<Icon
						style={backIconStyle}
						type="Entypo"
						name="chevron-thin-left"
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
								Get reset link
							</Button>

					</View>
				</SafeAreaView>
			</LinearGradient>
		);
	}
}

const styles = {
	inputStyle: {
		color: 'white',
		width: '10%'
	},
	labelStyle: {
		color: 'white'
	},
	itemStyle: {
		margin: 10
	},
	backIconStyle: {
		color: 'white',
		top: 10,
		left: 0,
		marginBottom: 40
	},
	formStyle: {
		width: '90%'
	},
	titleStyle: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 30,
	}
};

function mapStateToProps(state) {
	return {
		passwordMessage: state.auth.passwordMessage,
		passwordMessageFail: state.auth.passwordMessageFail
	};
}

export default connect(
	mapStateToProps,
	{ resetMessage, passwordReset }
)(forgotPassword);
