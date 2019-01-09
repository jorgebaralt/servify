import React, { Component } from 'react';
import { LinearGradient } from 'expo';
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	SafeAreaView,
	Platform,
	Keyboard,
	DeviceEventEmitter,
	ActivityIndicator,
	Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { Button, FloatingLabelInput } from '../../components/UI';
import { createEmailAccount } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let backPressSubscriptions;

const initialState = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	loading: false
};
class CreateAccountScreen extends Component {
	state = initialState;

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Create Account Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	showToast = (text, type) => {
		this.setState({ loading: false });
		this.props.showToast({ message: text, type, duration: 3000 });
		if (type === 'success') {
			this.clearState();
		}
	};

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


	createAccount = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const { firstName, lastName, email, password } = this.state;
		const user = {
			firstName,
			lastName,
			email,
			password
		};
		await createEmailAccount(user, (text, type) => this.showToast(text, type));
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
					<KeyboardAvoidingView
						behavior="padding"
						style={{ flex: 1, justifyContent: 'center' }}
					>
						<ScrollView>
							<View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
								<Text style={titleStyle}>Sign up</Text>
								<FloatingLabelInput
									value={this.state.firstName}
									label="First name"
									firstColor={colors.white}
									secondColor={colors.white}
									onChangeText={(firstName) => {
										this.setState({ firstName });
									}}
									style={{ marginTop: 20 }}
								/>
								<FloatingLabelInput
									value={this.state.lastName}
									label="Last name"
									firstColor={colors.white}
									secondColor={colors.white}
									onChangeText={(lastName) => {
										this.setState({ lastName });
									}}
									style={{ marginTop: 20 }}
								/>
								<FloatingLabelInput
									value={this.state.email}
									label="Email"
									firstColor={colors.white}
									secondColor={colors.white}
									onChangeText={(email) => {
										this.setState({ email });
									}}
									style={{ marginTop: 20 }}
									autoCapitalize="none"
								/>
								<FloatingLabelInput
									value={this.state.password}
									label="Password"
									firstColor={colors.white}
									secondColor={colors.white}
									onChangeText={(password) => {
										this.setState({ password });
									}}
									style={{ marginTop: 20 }}
									secureTextEntry
								/>
								<Button
									bordered
									light
									style={{ marginTop: 40 }}
									onPress={this.createAccount}
								>
									<Text>Create Account</Text>
								</Button>
								{this.renderSpinner()}

							</View>
						</ScrollView>
					</KeyboardAvoidingView>
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


export default connect(null, { showToast })(CreateAccountScreen);
