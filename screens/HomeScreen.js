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
	getServicesByZipcode,
	getNewNearServices,
	getUserLocation,
	getPopularCategories,
	getPopularNearServices,
	selectCategory
} from '../actions';
import { pageHit } from '../helper/ga_helper';

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
		refreshing: false
	};

	async componentWillMount() {
		await this.props.getCurrentUserDisplayName();
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

	componentDidMount() {
		pageHit('Home Screen');
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
		await this.props.getPopularCategories();
		if (status === 'granted') {
			if (!this.props.userLocation) {
				await this.props.getUserLocation();
			}
			await this.props.getNewNearServices(
				this.props.userLocation.coords,
				DISTANCE
			);
			await this.props.getPopularNearServices(
				this.props.userLocation.coords,
				DISTANCE
			);
		}
	};

	renderNearServicesList = (service, i) => (
		<SpecificServiceCard
			last={this.props.nearServicesList.length - 1 === i}
			service={service}
			showLocation
			onPress={() => {
				this.props.selectService(service);
				this.props.navigation.navigate('service');
			}}
		/>
	);

	renderNewServicesNear = () => {
		if (
			this.props.nearServicesList
			&& this.props.nearServicesList.length > 0
		) {
			return (
				<View style={{ marginTop: 15 }}>
					<Text style={styles.titleStyle}>New services near you</Text>
					<FlatList
						data={this.props.nearServicesList}
						renderItem={({ item, index }) => this.renderNearServicesList(item, index)
						}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
		if (
			this.props.nearServicesList
			&& this.props.nearServicesList.length === 0
		) {
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

	doSelectCategory = async (category) => {
		await this.props.selectCategory(category);
		// pick where to navigate
		if (category.subcategories) {
			this.props.navigation.navigate('subcategories');
		} else {
			this.props.navigation.navigate('servicesList');
		}
	};

	renderSpinner() {
		if (
			this.props.popularCategories === undefined
			&& this.props.popularNearServices === undefined
			&& this.props.nearServicesList === undefined
		) {
			return <Spinner style={{ marginTop: '10%' }} color="orange" />;
		}
		return <View />;
	}

	renderSecondSpinner() {
		if (
			this.props.popularCategories !== undefined
			&& this.props.popularNearServices === undefined
			&& this.props.nearServicesList === undefined
		) {
			return <Spinner style={{ marginTop: '10%' }} color="orange" />;
		}
	}

	renderThirdSpinner() {
		if (
			this.props.popularCategories !== undefined
			&& this.props.popularNearServices !== undefined
			&& this.props.nearServicesList === undefined
		) {
			return <Spinner style={{ marginTop: '10%' }} color="orange" />;
		}
	}

	renderPopularCategoriesList = (category, i) => {
		return (
			<CategoryCard
				last={this.props.popularCategories.length - 1 === i}
				cardStyle={styles.cardStyle}
				category={category}
				onPress={() => this.doSelectCategory(category)}
			/>
		);
	};

	renderPopularCategories = () => {
		if (this.props.popularCategories) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>Popular categories</Text>
					<FlatList
						data={this.props.popularCategories}
						renderItem={({ item, index }) => this.renderPopularCategoriesList(item, index)
						}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
	};

	renderPopularNearServicesList = (service, i) => (
		<View>
			<SpecificServiceCard
				last={this.props.popularNearServices.length - 1 === i}
				service={service}
				showRating
				onPress={() => {
					this.props.selectService(service);
					this.props.navigation.navigate('service');
				}}
			/>
		</View>
	);

	renderPopularNearServices = () => {
		if (
			this.props.popularNearServices
			&& this.props.popularNearServices.length > 0
		) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>Popular near services</Text>
					<FlatList
						data={this.props.popularNearServices}
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
						<View>{this.renderSpinner()}</View>
						{this.renderPopularCategories()}
						<View>{this.renderSecondSpinner()}</View>
						{this.renderNewServicesNear()}
						<View>{this.renderThirdSpinner()}</View>
						{this.renderPopularNearServices()}
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
		marginRight: 20
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
		nearServicesList: state.serviceResult.nearServicesList,
		userLocation: state.auth.location,
		popularCategories: state.serviceResult.popularCategory,
		popularNearServices: state.serviceResult.popularNearServices
	};
}

export default connect(
	mapStateToProps,
	{
		getCurrentUserDisplayName,
		selectService,
		getServicesByZipcode,
		getNewNearServices,
		getUserLocation,
		getPopularNearServices,
		getPopularCategories,
		selectCategory
	}
)(HomeScreen);
