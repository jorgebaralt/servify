import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	BackHandler,
	SafeAreaView,
	FlatList,
	RefreshControl,
} from 'react-native';
import {
	Text,
	Container,
	Content,
	Icon,
	Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { Permissions } from 'expo';
import {
	getCurrentUserDisplayName,
	selectService,
	getServicesByZipcode,
	getNearServices,
	getUserLocation
} from '../actions';
import SpecificServiceCard from '../components/SpecificServiceCard';

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
		this.setState({ refreshing: true });
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			await this.props.getUserLocation();
			await this.props.getNearServices(
				this.props.userLocation.coords,
				DISTANCE
			);
		} else {
			throw new Error('Location permission not granted');
		}
		this.setState({ refreshing: false });
	};

	onRefresh = async () => {
		await this.props.getNearServices(this.props.userLocation.coords, DISTANCE);
	};

	renderNearServicesList = (service) => {
		return (
			<SpecificServiceCard
				service={service}
				onPress={() => {
				this.props.selectService(service);
				this.props.navigation.navigate('service');
				}}
			/>
		);
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner style={{ marginTop: '50%' }} color="orange" />;
		}
		return <View />;
	}

	renderNewServicesNear = () => {
		if (this.props.nearServicesList) {
			return (
				<View style={{ marginTop: 25 }}>
					<Text style={styles.titleStyle}>New services near you</Text>
					<FlatList
						data={this.props.nearServicesList}
						renderItem={({ item }) => this.renderNearServicesList(item)}
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
						{/* {this.renderSpinner()} */}
						{this.renderNewServicesNear()}
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
};

function mapStateToProps(state) {
	return {
		nearServicesList: state.serviceResult.nearServicesList,
		userLocation: state.auth.location
	};
}

export default connect(
	mapStateToProps,
	{
		getCurrentUserDisplayName,
		selectService,
		getServicesByZipcode,
		getNearServices,
		getUserLocation
	}
)(HomeScreen);
