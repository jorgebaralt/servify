import React, { Component } from 'react';
import { View, DeviceEventEmitter, BackHandler, Platform } from 'react-native';
import {
	Text,
	Container,
	Content,
	Icon,
	Header,
	Left,
	Right,
	Button,
	Title,
	Body
} from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import { getCurrentUserDisplayName } from '../actions';

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
			return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
		}
		throw new Error('Location permission not granted');
	};

	newServicesNear = () => {
		return (
			<View>
				<Text style={styles.titleStyle}>New services near you</Text>
			</View>
		);
	}

	render() {
		const { androidHeader, iosHeader } = styles;
		return (
			<Container
				style={{ flex: 1, backgroundColor: '#FFFFFF', }}
				forceInset={{ bottom: 'always' }}
			>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left />
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'black', fontSize: 22 }}>Servify</Title>
					</Body>
					<Right />
				</Header>
				<Content style={{ margin: 10 }}>
					{this.newServicesNear()}
				</Content>
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
	}
};

function mapStateToProps(state) {
	return {};
}

export default connect(
	mapStateToProps,
	{ getCurrentUserDisplayName }
)(HomeScreen);
