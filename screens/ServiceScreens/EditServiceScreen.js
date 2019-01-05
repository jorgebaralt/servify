import React, { Component } from 'react';
import { Toast } from 'native-base';
import {
	Alert,
	KeyboardAvoidingView,
	View,
	Keyboard,
	DeviceEventEmitter,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	Text,
	Slider
} from 'react-native';
import { MapView } from 'expo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import {
	deleteService,
	updateService,
	getLocationFromAddress
} from '../../api';
import {
	CustomHeader,
	FloatingLabelInput,
	TextArea,
	Button
} from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { formatPhone } from '../../shared/helpers';

let willFocusSubscription;
let backPressSubscriptions;
class EditServiceScreen extends Component {
	state = {
		title: this.props.service.title,
		description: this.props.service.description,
		phone: this.props.service.phone,
		location:
			this.props.service.locationData.city
			+ ', '
			+ this.props.service.locationData.region
			+ ' '
			+ this.props.service.locationData.postalCode,
		miles: this.props.service.miles,
		region: {
			latitude: this.props.service.geolocation.latitude,
			longitude: this.props.service.geolocation.longitude,
			latitudeDelta: 0.03215 * this.props.service.miles,
			longitudeDelta: 0.0683 * this.props.service.miles
		},
		radius: this.props.service.miles * 1609.34,
		center: {
			latitude: this.props.service.geolocation.latitude,
			longitude: this.props.service.geolocation.longitude
		},
		loading: false
	};

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Edit Service Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	// Location handlers
	updateLocation = async (text) => {
		// if empty the text box, go to current location
		if (text.length < 2) {
			const { coords } = this.props.userLocation;
			this.setState((prevState) => ({
				region: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: prevState.latitudeDelta,
					longitudeDelta: prevState.longitudeDelta
				},
				center: {
					latitude: coords.latitude,
					longitude: coords.longitude
				}
			}));
		} else {
			// update map to new location
			const newAddress = await getLocationFromAddress(text);
			if (newAddress.longitude && newAddress.latitude) {
				this.setState((prevState) => ({
					region: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude,
						latitudeDelta: prevState.latitudeDelta,
						longitudeDelta: prevState.longitudeDelta
					},
					center: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude
					}
				}));
			}
		}
	};

	onLocationChange = async (location) => {
		this.setState({ location });
		this.updateLocation(location);
	};

	// update map with miles
	onMilesChange = (value) => {
		this.setState({ miles: value });
		this.setState((prevState) => ({
			radius: value * 1609.34,
			region: {
				latitude: prevState.region.latitude,
				longitude: prevState.region.longitude,
				latitudeDelta: 0.03215 * value,
				longitudeDelta: 0.0683 * value
			}
		}));
	};

	showToast = (text, type) => {
		this.setState({ loading: false });
		Toast.show({
			text,
			duration: 2000,
			type
		});
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
		backPressSubscriptions.add(() => this.props.navigation.pop());
	};

	deleteService = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		await deleteService(this.props.service);
		this.setState({
			title: '',
			description: '',
			phone: '',
			location: '',
			miles: '',
			loading: false
		});
		this.props.navigation.pop(3);
	};

	deleteAlert = () => {
		Alert.alert('Delete', 'Are you sure you want to delete this service?', [
			{
				text: 'Delete',
				onPress: () => this.deleteService(),
				style: 'destructive'
			},
			{
				text: 'Cancel'
			}
		]);
	};

	updateService = async () => {
		Keyboard.dismiss();
		this.scrollRef.scrollTo(0);
		this.setState({ loading: true });
		const updatedService = {
			category: this.props.service.category,
			subcategory: this.props.service.subcategory,
			title: this.state.title,
			phone: this.state.phone,
			location: this.state.location,
			miles: this.state.miles,
			description: this.state.description,
			displayName: this.props.user.displayName,
			email: this.props.user.email,
			ratingCount: this.props.service.ratingCount,
			ratingSum: this.props.service.ratingSum,
			rating: this.props.service.rating,
			favUsers: this.props.service.favUsers
		};
		await updateService(updatedService, (text, type) => this.showToast(text, type));
		this.props.navigation.pop(3);
	};

	// format phone text
	phoneChangeText = (text) => {
		const result = formatPhone(text);
		this.setState({ phone: result });
	};

	// Icon on left header
	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => this.props.navigation.pop(2)}
			disabled={this.state.loading}
		/>
	);

	headerRightIcon = () => (
		<MaterialIcons
			name="delete"
			size={32}
			style={{ color: colors.danger }}
			onPress={() => this.deleteAlert()}
			disabled={this.state.loading}
		/>
	);

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					size="large"
					color="#FF7043"
					style={{ marginTop: 10 }}
				/>
			);
		}
		return <View />;
	}

	render() {
		const { contentStyle, buttonStyle } = styles;
		// TODO: WORKING HERE
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<CustomHeader
					title="Edit your Service"
					left={this.headerLeftIcon()}
					right={this.headerRightIcon()}
				/>
				<KeyboardAvoidingView
					behavior="padding"
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<ScrollView
						style={contentStyle}
						keyboardShouldPersistTaps="handled"
						ref={(scrollRef) => { this.scrollRef = scrollRef; }}
					>
						{this.renderSpinner()}
						<FloatingLabelInput
							label="Service title"
							value={this.state.title}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							onChangeText={(title) => this.setState({ title })}
							fontColor={colors.black}
							maxLength={25}
							style={{ marginTop: 20 }}
						/>
						<TextArea
							style={{ marginTop: 20 }}
							label="Description"
							size={40}
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							multiline
							bordered
							numberOfLines={6}
							placeholder="Describe your Service Here"
							value={this.state.description}
							onChangeText={(description) => this.setState({ description })
							}
						/>

						<FloatingLabelInput
							value={this.state.phone}
							label="Contact phone"
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							onChangeText={(phone) => this.phoneChangeText(phone)
							}
							style={{ marginTop: 20 }}
							maxLength={16}
							keyboardType="phone-pad"
						/>
						<FloatingLabelInput
							value={this.state.location}
							label="Address, Zip Code, or Location"
							firstColor={colors.darkGray}
							secondColor={colors.secondaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.onLocationChange(text)}
							style={{ marginTop: 20 }}
						/>
						<Text
							style={[
								globalStyles.sectionTitle,
								{ marginTop: 10, fontWeight: '300' }
							]}
						>
							Distance:{' '}
							<Text style={{ fontWeight: '400' }}>
								{this.state.miles} miles
							</Text>
						</Text>
						<Slider
							onValueChange={(value) => this.onMilesChange(value)}
							value={this.state.miles}
							step={1}
							minimumValue={1}
							maximumValue={60}
							minimumTrackTintColor={colors.secondaryColor}
							thumbTintColor={colors.secondaryColor}
						/>
						<View pointerEvents="none">
							<MapView
								style={{
									height: 200,
									width: '100%',
									marginTop: 20,
									borderRadius: 8
								}}
								region={this.state.region}
							>
								<MapView.Circle
									center={this.state.center}
									radius={this.state.radius}
									strokeColor="#FF7043"
								/>
							</MapView>
						</View>
						<Button
							bordered
							disabled={this.state.loading}
							style={buttonStyle}
							onPress={() => this.updateService()}
							color={colors.primaryColor}
							textColor={colors.primaryColor}
						>
							<Text>Update Service</Text>
						</Button>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}
const styles = {
	contentStyle: {
		flex: 1,
		marginTop: 10,
		paddingLeft: 20,
		paddingRight: 20
	},
	buttonStyle: {
		top: 20,
		marginBottom: 30,
		width: '100%'
	}
};

const mapStateToProps = (state) => ({
	service: state.selectedService.service,
	user: state.auth.user
});

export default connect(mapStateToProps)(EditServiceScreen);
