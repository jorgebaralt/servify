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
	Text
} from 'react-native';
import { connect } from 'react-redux';
import { Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, InfoImage, HomeServiceCard, CategoryCard } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { selectService, getUserLocation, selectCategory } from '../../actions';
import * as api from '../../api';
import { pageHit } from '../../shared/ga_helper';

let backPressSubscriptions;
let willFocusSubscription;
let didFocusSubscription;
const DISTANCE = 30;

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
		dataLoaded: false
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
		await this.props.selectCategory(category);
		if (category.subcategories) {
			// FIXME: never happening, because is not on back-end
			this.props.navigation.navigate('subcategories');
		} else {
			this.props.navigation.navigate('servicesList');
		}
	};

	// each item new near services
	renderNearNearServices = (service, i) => (
		<HomeServiceCard
			last={this.state.newNearServices.length - 1 === i}
			service={service}
			showLocation
			onPress={() => {
				this.props.selectService(service);
				this.props.navigation.navigate('service');
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
				service={service}
				showRating
				onPress={() => {
					this.props.selectService(service);
					this.props.navigation.navigate('service');
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
						Popular near services
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
					{this.renderNewServicesNear()}
					{this.renderPopularNearServices()}
					{/* Show image when last service list is rendered */}
					<View style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text
							style={[
								globalStyles.sectionTitle,
							]}
						>
							Keep growing
						</Text>
						<InfoImage
							image={require('../../assets/backgrounds/yellow.jpg')}
							text="Host your service near Orlando, FL "
							buttonText="Post a service"
							style={{ marginTop: 5, height: 250 }}
							rounded
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
									Host your service near Orlando, FL{' '}
								</Text>
								<Button bordered style={{ fontSize: 20 }}>
									Publish your service
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
						tintColor="orange"
						colors={['orange']}
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
		width: 140,
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
		selectService,
		getUserLocation,
		selectCategory
	}
)(HomeScreen);
