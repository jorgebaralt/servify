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
import {
	Text,
	Container,
	Content,
	Icon,
	Card,
	CardItem,
	Body,
	Right
} from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import {
	getCurrentUserDisplayName,
	selectService,
	getServicesByZipcode
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
		if (status === 'granted') {
			const location = await Location.getCurrentPositionAsync({
				enableHighAccuracy: true
			});
			this.props.getServicesByZipcode(location.coords);
		} else {
			throw new Error('Location permission not granted');
		}
	};

	renderNearServicesList = (service) => {
		const {
			cardStyle,
			titleStyleCard,
			phoneLocationStyle,
			displayNameStyle,
			cardHeaderStyle,
			cardItemStyle
		} = styles;
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.selectService(service);
					this.props.navigation.navigate('service');
				}}
			>
				<Card style={cardStyle}>
					<CardItem header style={cardHeaderStyle}>
						<Text style={titleStyleCard}>{service.title}</Text>
						<Text style={displayNameStyle}>by: {service.displayName}</Text>
					</CardItem>
					<CardItem style={cardItemStyle}>
						<Body style={phoneLocationStyle}>
							<Text>{service.phone}</Text>
							<Text style={{ marginLeft: '15%' }}>{service.location.city}</Text>
						</Body>
						<Right>
							<Icon
								name="arrow-forward"
								style={{ color: this.props.category.color[0] }}
							/>
						</Right>
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	};

	newServicesNear = () => (
		<View style={{ marginTop: 25 }}>
			<Text style={styles.titleStyle}>New services near you</Text>
			{/* <FlatList
				data={[1, 2, 3]}
				renderItem={({ item }) => this.renderNearServicesList(item)}
				keyExtractor={(item, i) => i + '1'}
				horizontal
			/> */}
		</View>
	);

	render() {
		return (
			<Container
				style={{ flex: 1, backgroundColor: '#FFFFFF' }}
				forceInset={{ bottom: 'always' }}
			>
				<SafeAreaView style={{ margin: 10, flex: 1 }}>
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
		fontSize: 26
	},
	cardStyle: {
		width: '80%',
		marginLeft: '10%',
		marginTop: '2.5%',
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1
	},
	contentStyle: {},
	titleStyleCard: {
		fontSize: 18
	},
	phoneLocationStyle: {
		flexDirection: 'row',
		flex: 1
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
		fontSize: 14,
		fontWeight: undefined
	},
	cardItemStyle: {
		marginTop: -10
	}
};

function mapStateToProps(state) {
	return {};
}

export default connect(
	mapStateToProps,
	{ getCurrentUserDisplayName, selectService, getServicesByZipcode }
)(HomeScreen);
