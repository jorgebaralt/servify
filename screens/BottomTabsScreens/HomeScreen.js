import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	BackHandler,
	FlatList,
	RefreshControl,
	Alert,
	Linking,
	ScrollView,
	ActivityIndicator,
	Text,
	Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	Button,
	InfoImage,
	HomeServiceCard,
	CategoryCard
} from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { getUserLocation } from '../../actions';
import * as api from '../../api';
import { pageHit } from '../../shared/ga_helper';

let backPressSubscriptions;
let willFocusSubscription;
let didFocusSubscription;
let currentCity;
const DISTANCE = 30;
const WIDTH = Dimensions.get('window').width;

class HomeScreen extends Component {
	static navigationOptions = {
		title: 'Home',
		tabBarIcon: ({ tintColor }) => (
			<MaterialCommunityIcons
				size={32}
				name="home-outline"
				style={{ color: tintColor }}
			/>
		)
	};

	state = {
		refreshing: false,
		popularCategories: undefined,
		popularNearServices: undefined,
		newNearServices: undefined,
		dataLoaded: false,
		currentCity: ''
	};

	async componentDidMount() {
		pageHit('Home Screen');
		await this.getLocationAsync();

		didFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			this.handleAndroidBack
		);

		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.onRefresh
		);
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		didFocusSubscription.remove();
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
		backPressSubscriptions.add(() => BackHandler.exitApp());
	};

	getLocationAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			await this.props.getUserLocation();
		} else {
			Alert.alert(
				'Allow Servify to access your location while you are using the app?',
				'Servify uses current location to find and display nearby services, for better performance, go to settings and allow Servify to use your location while using the app.',
				[
					{
						text: 'Go to settings',
						onPress: () => Linking.openURL('app-settings:')
					},
					{
						text: 'Cancel'
					}
				]
			);
		}
		this.onRefresh();
	};

	onRefresh = async () => {
		const { status } = await Permissions.getAsync(Permissions.LOCATION);
		// Get popular Categories, no need location for this
		await api.getPopularCategories((popularCategories) => this.setState({ popularCategories }));
		if (status === 'granted') {
			if (!this.props.userLocation) {
				await this.props.getUserLocation();
			}
			// Loc info
			await api.getLocationInfo({
				latitude: this.props.userLocation.coords.latitude,
				longitude: this.props.userLocation.coords.longitude
			},(locInfo) => this.setState({ currentCity: locInfo.city + ' ' + locInfo.region }));

			
			// Get New Near Services
			await api.getNewNearServices(
				this.props.userLocation.coords,
				DISTANCE,
				(newNearServices) => this.setState({ newNearServices })
			);
			// Get Popular Near Services
			await api.getPopularNearServices(
				this.props.userLocation.coords,
				DISTANCE,
				(popularNearServices) => this.setState({ popularNearServices })
			);
			if (
				this.state.popularCategories
				&& this.state.newNearServices
				&& this.state.popularNearServices
			) {
				this.setState({ dataLoaded: true });
			}
		}
	};

	// on category selected
	doSelectCategory = async (category) => {
		if (category.subcategories) {
			// FIXME: never happening, because is not on back-end
			this.props.navigation.navigate('subcategories', { category });
		} else {
			this.props.navigation.navigate('servicesList', { category });
		}
	};

	// each item new near services
	renderNearNearServices = (service, i) => (
		<HomeServiceCard
			last={this.state.newNearServices.length - 1 === i}
			uri={service.imagesInfo ? service.imagesInfo[0].url : null}
			image={require('../../assets/default/food/1.jpg')}
			service={service}
			showLocation
			onPress={() => {
				this.props.navigation.navigate('service', { service });
			}}
		/>
	);

	// Make sure we can render new near services
	renderNewServicesNear = () => {
		if (this.state.newNearServices.length > 0) {
			return (
				<View style={{ marginTop: 5 }}>
					<Text
						style={[globalStyles.sectionTitle, { marginLeft: 20 }]}
					>
						New services near you
					</Text>
					<FlatList
						data={this.state.newNearServices}
						renderItem={({ item, index }) => this.renderNearNearServices(item, index)
						}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
		if (this.state.newNearServices.length === 0) {
			// TODO: change for image
			return (
				<View style={{ marginTop: 10, marginBottom: 10 }}>
					<Text style={styles.textStyle}>
						No new services near you, be the first on creating new
						services around your area on the
						<Text
							style={[styles.textStyle, { color: '#0277BD' }]}
							onPress={() => this.props.navigation.navigate('publishInfo')
							}
						>
							{' '}
							Post tab
						</Text>
					</Text>
				</View>
			);
		}
	};

	// each item in popular categories
	renderPopularCategoriesList = (category, i) => (
		<CategoryCard
			last={this.state.popularCategories.length - 1 === i}
			cardStyle={styles.cardStyle}
			category={category}
			onPress={() => this.doSelectCategory(category)}
		/>
	);

	// make sure we can render popular categories
	renderPopularCategories = () => (
		<View style={{ marginTop: 45 }}>
			<Text style={[globalStyles.sectionTitle, { marginLeft: 20 }]}>
				Popular categories
			</Text>
			<FlatList
				data={this.state.popularCategories}
				renderItem={({ item, index }) => this.renderPopularCategoriesList(item, index)
				}
				keyExtractor={(item) => item.title}
				horizontal
			/>
		</View>
	);

	// each item in popular near services
	renderPopularNearServicesList = (service, i) => (
		<View>
			<HomeServiceCard
				last={this.state.popularNearServices.length - 1 === i}
				image={require('../../assets/default/food/1.jpg')}
				uri={service.imagesInfo ? service.imagesInfo[0].url : null}
				service={service}
				showRating
				onPress={() => {
					this.props.navigation.navigate('service', { service });
				}}
			/>
		</View>
	);

	// make sure we can render popular near services
	renderPopularNearServices = () => {
		if (this.state.popularNearServices.length > 0) {
			return (
				<View style={{ marginTop: 5 }}>
					<Text
						style={[globalStyles.sectionTitle, { marginLeft: 20 }]}
					>
						Top rated near service
					</Text>
					<FlatList
						data={this.state.popularNearServices}
						renderItem={({ item, index }) => this.renderPopularNearServicesList(item, index)
						}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
	};

	// Render content when all fetches are completed.
	renderContent() {
		if (this.state.dataLoaded) {
			return (
				<View>
					{this.renderPopularCategories()}
					<View style={{ paddingLeft: 20, paddingRight: 20 }}>
						<InfoImage
							uri="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
							text="Host your service near Orlando, FL "
							buttonText="Post a service"
							style={{
								marginTop: 20,
								height: 250,
								marginBottom: 20
							}}
							rounded
							onPress={() => this.props.navigation.navigate('browse')
							}
							opacity={0.2}
						>
							<View
								style={{
									position: 'absolute',
									left: 20,
									bottom: 20,
									right: 5
								}}
							>
								<Text
									style={{
										fontSize: 30,
										fontWeight: '600',
										color: colors.white,
										marginBottom: 40
									}}
								>
									More categories
								</Text>
								<Button
									bordered
									style={{ fontSize: 20 }}
									onPress={() => this.props.navigation.navigate(
											'publishInfo'
										)
									}
								>
									<Text>Browse</Text>
								</Button>
							</View>
						</InfoImage>
					</View>

					{this.renderNewServicesNear()}
					{this.renderPopularNearServices()}
					{/* Show image when last service list is rendered */}
					<View style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text style={[globalStyles.sectionTitle]}>
							Keep growing
						</Text>
						<InfoImage
							uri="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
							text="Host your service near Orlando, FL "
							buttonText="Post a service"
							style={{
								marginTop: 5,
								height: 250,
								marginBottom: 20
							}}
							rounded
							onPress={() => this.props.navigation.navigate('publishInfo')
							}
						>
							<View
								style={{
									position: 'absolute',
									left: 20,
									bottom: 20,
									right: 5
								}}
							>
								<Text
									style={{
										fontSize: 30,
										fontWeight: '600',
										color: colors.white,
										marginBottom: 40
									}}
								>
									Publish a service near {this.state.currentCity}
								</Text>
								<Button
									bordered
									style={{ fontSize: 20 }}
									onPress={() => this.props.navigation.navigate(
											'publishInfo'
										)
									}
								>
									<Text>Publish your service</Text>
								</Button>
							</View>
						</InfoImage>
					</View>
				</View>
			);
		}
		return (
			<ActivityIndicator
				style={{ marginTop: 100 }}
				size="large"
				color="#FF7043"
			/>
		);
	}

	render() {
		return (
			<ScrollView
				style={{
					flex: 1,
					marginTop: 0,
					paddingTop: 0,
					backgroundColor: '#FFFFFF'
				}}
				refreshControl={(
<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={async () => this.onRefresh()}
						tintColor={colors.primaryColor}
						colors={[colors.primaryColor]}
/>
)}
			>
				{this.renderContent()}
			</ScrollView>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
	textStyle: {
		fontSize: 22,
		marginLeft: 20,
		marginRight: 20
	},
	cardStyle: {
		height: 70,
		borderRadius: 8,
		marginLeft: 20,
		marginTop: 10,
		marginBottom: 10,
		width: (WIDTH - 60) * 0.45,
		overflow: 'hidden'
	}
};

function mapStateToProps(state) {
	return {
		userLocation: state.location.data
	};
}

export default connect(
	mapStateToProps,
	{
		getUserLocation
	}
)(HomeScreen);
