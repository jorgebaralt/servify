import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	BackHandler,
	Platform,
	SafeAreaView,
	FlatList,
	TouchableOpacity
} from 'react-native';
import { Text, Container, Content, Icon, Card, CardItem } from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import {
	getCurrentUserDisplayName,
	selectService,
	getServicesByZipcode,
	getNearServices
} from '../actions';

let backPressSubscriptions;
let willFocusSubscription;

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

	async componentWillMount() {
		await this.props.getCurrentUserDisplayName();
		this.getLocationAsync();

		willFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			this.handleAndroidBack
		);
	}

	componentWillUpdate(nextProps) {}

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
		backPressSubscriptions.add(() => BackHandler.exitApp());
	};

	getLocationAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);
		const distance = 30;
		if (status === 'granted') {
			const location = await Location.getCurrentPositionAsync({
				enableHighAccuracy: true
			});
			// this.props.getServicesByZipcode(location.coords);
			this.props.getNearServices(location.coords, distance);
		} else {
			throw new Error('Location permission not granted');
		}
	};

	renderNearServicesList = (service) => {
		const {
			cardStyle,
			titleStyleCard,
			displayNameStyle,
			cardHeaderStyle
		} = styles;
		return (
			<TouchableOpacity
				style={{ marginBottom: 10 }}
				onPress={() => {
					this.props.selectService(service);
					this.props.navigation.navigate('service');
				}}
			>
				<Card style={cardStyle}>
					<CardItem header style={cardHeaderStyle}>
						<Text style={titleStyleCard}>{service.title}</Text>
						<Text style={[displayNameStyle, { marginTop: 10 }]}>
							by: {service.displayName}
						</Text>
						<Text style={displayNameStyle}>{service.phone}</Text>
						<Text style={displayNameStyle}>{service.location.city}</Text>
						<Text style={displayNameStyle}>{service.zipCode}</Text>
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	};

	newServicesNear = () => (
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

	render() {
		return (
			<Container
				style={{ flex: 1, backgroundColor: '#FFFFFF' }}
				forceInset={{ bottom: 'always' }}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<Content style={{ flex: 1 }}>{this.newServicesNear()}</Content>
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
	cardStyle: {
		width: 140,
		height: 140,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		marginLeft: 20,
		marginTop: 20
	},
	contentStyle: {},
	titleStyleCard: {
		fontSize: 15
	},
	headerTitleStyle: {
		color: 'white'
	},
	cardHeaderStyle: {
		flexDirection: 'column',
		display: 'flex',
		alignItems: 'flex-start'
	},
	displayNameStyle: {
		fontSize: 13,
		fontWeight: undefined
	}
};

function mapStateToProps(state) {
	return {
		nearServicesList: state.serviceResult.nearServicesList
	};
}

export default connect(
	mapStateToProps,
	{
		getCurrentUserDisplayName,
		selectService,
		getServicesByZipcode,
		getNearServices
	}
)(HomeScreen);
