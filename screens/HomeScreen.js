import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	BackHandler,
	SafeAreaView,
	FlatList,
	RefreshControl
} from 'react-native';
import { Text, Container, Content, Icon, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { Permissions } from 'expo';
import CategoryCard from '../components/CategoryCard';
import {
	getCurrentUserDisplayName,
	selectService,
	getServicesByZipcode,
	getNearServices,
	getUserLocation,
	getPopularCategories,
	getPopularNearServices,
	selectCategory,
	cleanPopularNearServices
} from '../actions';
import SpecificServiceCard from '../components/SpecificServiceCard';

let backPressSubscriptions;
let willFocusSubscription;
let didFocusSubscription;
const DISTANCE = 50;

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
		loading: false
	};

	async componentWillMount() {
		this.setState({ loading: true });
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

		this.setState({ loading: false });
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
			await this.onRefresh();
		} else {
			throw new Error('Location permission not granted');
		}
	};

	onRefresh = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status === 'granted' && this.props.userLocation) {
			await this.props.getNearServices(
				this.props.userLocation.coords,
				DISTANCE
			);
			await this.props.getPopularNearServices(
				this.props.userLocation.coords,
				DISTANCE
			);
		}
		await this.props.getPopularCategories();
	};

	renderNearServicesList = (service) => (
		<SpecificServiceCard
			service={service}
			onPress={() => {
				this.props.selectService(service);
				this.props.navigation.navigate('service');
			}}
		/>
	);

	renderNewServicesNear = () => {
		if (this.props.nearServicesList && this.props.nearServicesList.length > 0) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>New services near you</Text>
					<FlatList
						style={{ marginLeft: 20 }}
						data={this.props.nearServicesList}
						renderItem={({ item }) => this.renderNearServicesList(item)}
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
						No new services near you, be the first on creating new services
						around your area on the
						<Text
							style={[styles.textStyle, { color: '#0277BD' }]}
							onPress={() => this.props.navigation.navigate('postService')}
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
		if (this.state.loading) {
			return <Spinner style={{ marginTop: '50%' }} color="orange" />;
		}
		return <View />;
	}

	renderPopularCategoriesList = (category) => (
		<CategoryCard
			cardStyle={styles.cardStyle}
			category={category}
			onPress={() => this.doSelectCategory(category)}
		/>
	);

	renderPopularCategories = () => {
		if (this.props.popularCategories) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>Popular categories</Text>
					<FlatList
						style={{ marginLeft: 20 }}
						data={this.props.popularCategories}
						renderItem={({ item }) => this.renderPopularCategoriesList(item)}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
	};

	renderPopularNearServicesList = (service) => (
		<View>
			<SpecificServiceCard
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
						style={{ marginLeft: 20 }}
						data={this.props.popularNearServices}
						renderItem={({ item }) => this.renderPopularNearServicesList(item)}
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
								onRefresh={() => this.onRefresh()}
								tintColor="orange"
								colors={['orange']}
/>
)}
					>
						{this.renderPopularCategories()}
						{this.renderNewServicesNear()}
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
		height: 140,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		marginRight: 20,
		marginTop: 20,
		marginBottom: 20
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
		getNearServices,
		getUserLocation,
		getPopularNearServices,
		getPopularCategories,
		selectCategory,
		cleanPopularNearServices
	}
)(HomeScreen);
