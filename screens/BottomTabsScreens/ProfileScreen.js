import React, { Component } from 'react';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import {
	FlatList,
	DeviceEventEmitter,
	Linking,
	SafeAreaView,
	Text
} from 'react-native';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import { profileList } from '../../shared/data';
import { CustomHeader, ListIcon } from '../../components/UI';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let backPressSubscriptions;
let willBlurSubscriptions;

class ProfileScreen extends Component {
	static navigationOptions = {
		title: 'Profile',
		tabBarIcon: ({ tintColor }) => (
			<Feather size={32} name="user" style={{ color: tintColor }} />
		)
	};

	state = { profileList };

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		willBlurSubscriptions = this.props.navigation.addListener(
			'willBlur',
			() => DeviceEventEmitter.removeAllListeners('hardwareBackPress')
		);
		pageHit('Profile Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscriptions.remove();
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
		backPressSubscriptions.add(() => this.props.navigation.navigate('home'));
	};

	goSelectedScreen = (item) => {
		if (item.isList) {
			this.props.navigation.navigate('profileService', { item });
		} else if (item.id === 'feedback') {
			this.props.navigation.navigate('feedback');
		} else if (item.id === 'contactUs') {
			Linking.openURL('mailto:servifyapp@gmail.com');
		} else if (item.id === 'help') {
			this.props.navigation.navigate('help');
		}
	};

	rightList = (item) => {
		return (
			<MaterialIcons
				name={item.iconName}
				style={{ color: colors.black }}
				size={24}
			/>
		);
	}

	leftList = (item) => (
		<Text style={{ fontSize: 20, color: colors.black }}>{item.title}</Text>
	)

	renderListItems = (item) => (
		<ListIcon 
			style={{ marginTop: 50 }} 
			left={this.leftList(item)} 
			right={this.rightList(item)} 
			onPress={() => this.goSelectedScreen(item)}
		/>
	);

	leftHeader = () => (
		<Text style={{ fontWeight: '600', fontSize: 22 }}>
			{this.props.user.displayName}
		</Text>
	);

	rightHeader = () => (
		<Entypo
			name="dots-three-horizontal"
			style={{ color: 'black' }}
			size={32}
			onPress={() => this.props.navigation.navigate('settings')}
		/>
	);

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<CustomHeader
					left={this.leftHeader()}
					right={this.rightHeader()}
				/>

				<FlatList
					data={this.state.profileList}
					renderItem={({ item }) => this.renderListItems(item)}
					keyExtractor={(item) => item.title}
				/>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(mapStateToProps)(ProfileScreen);
