import React, { Component } from 'react';
import { LinearGradient, ImagePicker, Permissions } from 'expo';
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	SafeAreaView,
	Keyboard,
	DeviceEventEmitter,
	ActivityIndicator,
	Text,
	TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { Button, FloatingLabelInput, FadeImage } from '../../components/UI';
import { createEmailAccount, profileImageUpload } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let backPressSubscriptions;

const initialState = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	loading: false,
	imageInfo: null
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
		this.scrollview.scrollToEnd();
		this.setState({ loading: true });
		let imageInfo = null;
		if (this.state.imageInfo) {
			imageInfo = await profileImageUpload(this.state.imageInfo);
		}
		
		const { firstName, lastName, email, password } = this.state;
		const user = {
			firstName,
			lastName,
			email,
			password,
			imageInfo
		};
		await createEmailAccount(user, (text, type) => this.showToast(text, type));
	};

	pickImage = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(
			Permissions.CAMERA
		);

		const { status: cameraRollPerm } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				base64: true
			});
			if (!result.cancelled) {
				const fileName = result.uri.split('/').pop();
				// Infer the type of the image
				const match = /\.(\w+)$/.exec(fileName);
				const type = match ? `image/${match[1]}` : 'image';
				// TODO: add to state.
				// upload images, receives an array of images
				this.setState({
					imageInfo: {
						image: result.uri,
						fileName,
						type
					}
				});
			}
		}
	};

	clearState() {
		this.setState(initialState);
	}

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 20 }}
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
			>
				<SafeAreaView style={{ flex: 1 }}>
					<KeyboardAvoidingView
						behavior="padding"
						style={{ flex: 1 }}
					>
						<Ionicons
							style={backIconStyle}
							name="ios-arrow-back"
							size={40}
							onPress={() => {
								this.props.navigation.navigate('auth');
							}}
						/>
						<ScrollView ref={(scrollview) => { this.scrollview = scrollview; }}>
							<View
								style={{
									flex: 1,
									paddingLeft: 20,
									paddingRight: 20
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<Text style={titleStyle}>Sign up</Text>
									{this.state.imageInfo ? (
										<FadeImage onPress={this.pickImage} style={{ height: 100, width: 100, borderRadius: 50 }} uri={this.state.imageInfo.image} />
									) : (
										<View>
											<TouchableOpacity
												style={{
													height: 100,
													width: 100,
													borderRadius: 50,
													backgroundColor:
														colors.darkGray
												}}
												onPress={this.pickImage}
											/>
											<Text
												style={{
													fontSize: 12,
													color: colors.white,
													textAlign: 'center'
												}}
											>
												Add profile image
											</Text>
										</View>
									)}
								</View>

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
		marginBottom: 10
	},
	titleStyle: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 30,
		marginTop: 40
	}
};

export default connect(
	null,
	{ showToast }
)(CreateAccountScreen);
