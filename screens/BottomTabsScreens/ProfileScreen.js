import React, { Component } from 'react';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import {
	FlatList,
	DeviceEventEmitter,
	Linking,
	SafeAreaView,
	Text,
	View,
	Share,
	Platform,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import { profileList } from '../../shared/data';
import { CustomHeader, ListIcon, FadeImage } from '../../components/UI';
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
		} else {
			switch (item.id) {
				case 'feedback':
					this.props.navigation.navigate('feedback');
					break;
				case 'contactUs':
					Linking.openURL('mailto:servifyapp@gmail.com');
					break;
				case 'share':
					Share.share({
						title: 'Share Servify',
						message:
							'Download Servify, the best way to find local services in your area: ',
						url:
							Platform.OS === 'ios'
								? 'https://itunes.apple.com/us/app/servify-find-local-services/id1439203889?mt=8'
								: 'https://play.google.com/store/apps/details?id=com.jorgebaralt.servify'
					});
					break;
				case 'help':
					this.props.navigation.navigate('help');
					break;
				case 'editProfile':
					if (this.props.user.provider === (null || 'password')) {
						this.props.navigation.navigate('editUser');
					}
					break;
				default:
					break;
			}
		}
	};

	rightList = (item) => (
		<MaterialIcons
			name={item.iconName}
			style={{ color: colors.black }}
			size={24}
		/>
	);

	leftList = (item) => (
		<Text style={{ fontSize: 20, color: colors.black }}>{item.title}</Text>
	);

	renderListItems = (item) => {
		if (item.id === 'editProfile') {
			if (!(this.props.user.provider === (null || 'password'))) {
				return null;
			}
		}
		return (
			<ListIcon
				style={{ marginTop: 50 }}
				left={this.leftList(item)}
				right={this.rightList(item)}
				onPress={() => this.goSelectedScreen(item)}
			/>
		);
	};

	leftHeader = () => (
		<TouchableOpacity
			style={{ flexDirection: 'row' }}
			onPress={() => {
				if (this.props.user.provider === (null || 'password')) {
					this.props.navigation.navigate('editUser');
				}
			}}
		>
			{/* if there is image, show it */}
			{this.props.user.imageInfo || this.props.user.photoURL ? (
				<FadeImage
					style={{
						height: 30,
						width: 30,
						borderRadius: 15
					}}
					uri={
						this.props.user.photoURL
							? this.props.user.photoURL
							: this.props.user.imageInfo
							? this.props.user.imageInfo.url
							: null
					}
				/>
			) : (
				<View />
			)}

			<Text style={{ fontWeight: '600', fontSize: 22, marginLeft: 5 }}>
				{this.props.user.displayName}
			</Text>
		</TouchableOpacity>
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
			<View style={{ flex: 1 }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: colors.white }}
				>
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
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(mapStateToProps)(ProfileScreen);
