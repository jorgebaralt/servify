import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	BackHandler,
	SafeAreaView,
	FlatList,
	RefreshControl,
	Alert,
	Linking
} from 'react-native';
import { Text, Container, Content, Icon, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { Permissions } from 'expo';
import CategoryCard from '../components/CategoryCard';
import SpecificServiceCard from '../components/HomeComponents/SpecificServiceCard';
import {
	getCurrentUserDisplayName,
	selectService,
	getUserLocation,
	selectCategory
} from '../actions';
import * as api from '../api';
import { pageHit } from '../shared/ga_helper';

let backPressSubscriptions;
let willFocusSubscription;
let didFocusSubscription;
const DISTANCE = 30;

class HomeScreen extends Component {
	static navigationOptions = {
		title: 'Home',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				type="MaterialCommunityIcons"
				name="home-outline"
				style={{ color: tintColor }}
			/>
		)
	};

	state = {
		refreshing: false,
		popularCategories: undefined,
		popularNearServices: undefined,
		newNearServices: undefined
	};

	async componentDidMount() {
		pageHit('Home Screen');
		await this.props.getCurrentUserDisplayName();
		this.getLocationAsync();

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
		await this.onRefresh();
	};

	onRefresh = async () => {
		const { status } = await Permissions.getAsync(Permissions.LOCATION);
		// Get popular Categories no matter of status ()
		await api.getPopularCategories((popularCategories) => this.setState({ popularCategories }));
		if (status === 'granted') {
			if (!this.props.userLocation) {
				await this.props.getUserLocation();
			}
			// Get New Near Services
			await api.getNewNearServices(this.props.userLocation.coords, DISTANCE, (newNearServices) => this.setState({ newNearServices }));
			// Get Popular Near Services
			await api.getPopularNearServices(this.props.userLocation.coords, DISTANCE, (popularNearServices) => this.setState({ popularNearServices }));
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

	// Spinner
	renderSpinner() {
		if (
			(this.state.popularCategories === undefined
			&& this.state.popularNearServices === undefined
			&& this.state.newNearServices === undefined) 
			|| (this.state.popularCategories !== undefined
			&& this.state.popularNearServices === undefined
			&& this.state.newNearServices === undefined)
			|| (this.state.popularCategories !== undefined
			&& this.state.popularNearServices !== undefined
			&& this.state.newNearServices === undefined)
		) {
			return <Spinner style={{ marginTop: '10%' }} color="orange" />;
		}
		return <View />;
	}

	// each item new near services
	renderNearNearServices = (service, i) => (
		<SpecificServiceCard
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
		if (
			this.state.newNearServices
			&& this.state.newNearServices.length > 0
		) {
			return (
				<View style={{ marginTop: 15 }}>
					<Text style={styles.titleStyle}>New services near you</Text>
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
		if (
			this.state.newNearServices
			&& this.state.newNearServices.length === 0
		) {
			// TODO: change for image
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.textStyle}>
						No new services near you, be the first on creating new
						services around your area on the
						<Text
							style={[styles.textStyle, { color: '#0277BD' }]}
							onPress={() => this.props.navigation.navigate('postService')
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
	renderPopularCategoriesList = (category, i) => {
		return (
			<CategoryCard
				last={this.state.popularCategories.length - 1 === i}
				cardStyle={styles.cardStyle}
				category={category}
				onPress={() => this.doSelectCategory(category)}
			/>
		);
	};

	// make sure we can render popular categories
	renderPopularCategories = () => {
		if (this.state.popularCategories) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>Popular categories</Text>
					<FlatList
						data={this.state.popularCategories}
						renderItem={({ item, index }) => this.renderPopularCategoriesList(item, index)
						}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
	};

	// each item in popular near services
	renderPopularNearServicesList = (service, i) => (
		<View>
			<SpecificServiceCard
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
		if (
			this.state.popularNearServices
			&& this.state.popularNearServices.length > 0
		) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>Popular near services</Text>
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

	render() {
		return (
			<Container
				style={{ flex: 1, backgroundColor: '#FFFFFF' }}
				forceInset={{ bottom: 'always' }}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<Content
						style={{ flex: 1 }}
						refreshControl={(
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={async () => this.onRefresh()}
								tintColor="orange"
								colors={['orange']}
							/>
						)}
					>
						
						{this.renderPopularCategories()}
						{this.renderNewServicesNear()}
						{this.renderPopularNearServices()}
						{this.renderSpinner()}
					</Content>
				</SafeAreaView>
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
	titleStyle: {
		fontSize: 26,
		marginLeft: 20,
		marginRight: 20,
		fontWeight: '600'
	},
	textStyle: {
		fontSize: 22,
		marginLeft: 20,
		marginRight: 20
	},
	cardStyle: {
		width: 140,
		height: 70,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		marginTop: 20,
		marginBottom: 20,
		marginLeft: 20,
		borderRadius: 8,
		overflow: 'hidden'
	}
};

function mapStateToProps(state) {
	return {
		userLocation: state.auth.location,
	};
}

export default connect(
	mapStateToProps,
	{
		getCurrentUserDisplayName,
		selectService,
		getUserLocation,
		selectCategory
	}
)(HomeScreen);
