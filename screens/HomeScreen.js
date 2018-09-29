import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	DeviceEventEmitter,
	BackHandler
} from 'react-native';
import { Text, Container, Content, Icon } from 'native-base';
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
			'willFocus', this.handleAndroidBack
		);
	}

	componentWillUpdate(nextProps) { }
	
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
			return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
		}
		throw new Error('Location permission not granted');
	};

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: 'always' }}>
				<Content>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
					<Text>Home Screen</Text>
				</Content>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

export default connect(
	mapStateToProps,
	{ getCurrentUserDisplayName }
)(HomeScreen);
