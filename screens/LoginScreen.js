import React, { Component } from 'react';
import {
	Text,
	Form,
	Item,
	Button,
	Label,
	Input,
	Icon,
	Toast,
	Spinner
} from 'native-base';
import { LinearGradient } from 'expo';
import { View, SafeAreaView, Keyboard, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { emailAndPasswordLogin, resetMessage } from '../actions';
import { pageHit } from '../shared/ga_helper';

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
			return <Spinner color="white" />;
		}
		return <View />;
	}

	render() {
		const {
			inputStyle,
			labelStyle,
			itemStyle,
			backIconStyle,
			formStyle,
			titleStyle
		} = styles;

		return (
			<LinearGradient
				colors={['#FF7043', '#F4511E', '#BF360C']}
				style={{ flex: 1 }}
			>
				<SafeAreaView style={{ flex: 1}}>
					<Icon
						style={backIconStyle}
						type="Entypo"
						name="chevron-thin-left"
						onPress={() => {
							this.props.navigation.navigate('auth');
						}}
					/>

					{/* Login Form */}
					<View style={{ flex: 1, marginLeft: '5%' }}>
						<Text style={titleStyle}>Sign in</Text>
						<Form style={formStyle}>
							<Item floatingLabel style={itemStyle}>
								<Label style={labelStyle}>Email</Label>
								<Input
									autoCapitalize="none"
									style={inputStyle}
									value={this.state.email}
									onChangeText={(email) => {
										this.setState({ email });
									}}
								/>
							</Item>
							<Item floatingLabel style={itemStyle}>
								<Label style={labelStyle}>Password</Label>
								<Input
									style={inputStyle}
									value={this.state.password}
									secureTextEntry
									onChangeText={(password) => {
										this.setState({ password });
									}}
								/>
							</Item>
						</Form>
						{this.renderSpinner()}
						<View>
							<Button
								title="Login User"
								bordered
								light
								style={{ marginTop: 10, marginLeft: '3%' }}
								onPress={this.loginUser}
							>
								<Text>Log in</Text>
							</Button>
						</View>
					</View>
					<TouchableOpacity
						style={{ position: 'absolute', bottom: 40, right: 20 }}
					>
						<Text
							style={{ fontSize: 16, color: 'white' }}
							onPress={() => {
								this.props.navigation.navigate('forgotPassword');
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
		margin: 10
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
