import React, { Component } from 'react';
import { FlatList, DeviceEventEmitter, Platform, Linking } from 'react-native';
import {
	Container,
	Header,
	Body,
	Right,
	Button,
	Icon,
	Title,
	Text,
	Content,
	List,
	ListItem,
	Left
} from 'native-base';
import { connect } from 'react-redux';
import { getCurrentUserDisplayName } from '../actions';
import { pageHit } from '../shared/ga_helper';

let willFocusSubscription;
let backPressSubscriptions;
let willBlurSubscriptions;

class ProfileScreen extends Component {
	static navigationOptions = {
		title: 'Profile',
		tabBarIcon: ({ tintColor }) => (
			<Icon type="Feather" name="user" style={{ color: tintColor }} />
		)
	};

	componentWillMount() {
		if (!this.props.displayName) {
			this.props.getCurrentUserDisplayName();
		}
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		willBlurSubscriptions = this.props.navigation.addListener('willBlur', () => DeviceEventEmitter.removeAllListeners('hardwareBackPress'));
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

	renderListItems = (item) => (
		<ListItem
			onPress={() => this.goSelectedScreen(item)}
			style={{ marginTop: 30, marginRight: 10 }}
		>
			<Left>
				<Text>{item.title}</Text>
			</Left>
			<Right>
				<Icon
					type={item.iconType}
					name={item.iconName}
					style={{ color: 'black', fontSize: 28 }}
				/>
			</Right>
		</ListItem>
	);

	render() {
		const { androidHeader, iosHeader } = styles;
		return (
			<Container>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left style={{ flex: 4 }}>
						<Title style={{ color: 'black', marginLeft: 10 }}>
							{this.props.displayName}
						</Title>
					</Left>
					<Right>
						<Button
							transparent
							title="Settings"
							onPress={() => this.props.navigation.navigate('settings')}
						>
							<Icon
								type="Entypo"
								name="dots-three-horizontal"
								style={{ color: 'black' }}
							/>
						</Button>
					</Right>
				</Header>
				<Content>
					<FlatList
						data={this.props.profileList}
						renderItem={({ item }) => this.renderListItems(item)}
						keyExtractor={(item) => item.title}
					/>
				</Content>
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {}
};

function mapStateToProps(state) {
	return {
		displayName: state.auth.displayName,
		profileList: state.profileList
	};
}

export default connect(
	mapStateToProps,
	{ getCurrentUserDisplayName }
)(ProfileScreen);
