import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	DeviceEventEmitter,
	Platform,
	FlatList
} from 'react-native';
import {
	Header,
	Text,
	Card,
	CardItem,
	Body,
	Title,
	Container,
	Left,
	Button,
	Icon,
	Right,
	Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { getServicesByEmail, selectService } from '../actions';
import EmptyListMessage from '../components/EmptyListMessage';

let currentItem;
let errorMessage;
let willFocusSubscription;
let backPressSubscriptions;

class ProfileServicesScreen extends Component {
	state = {
		loading: false
	};

	async componentWillMount() {
		currentItem = this.props.navigation.getParam('item');
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			async () => {
				this.handleAndroidBack();
			}
		);

		if (currentItem.id === 'favorites') {
			errorMessage =				'There is nothing in this list, Make sure that you add Services to Favorite by cliking on the top right icon, when looking at services.';
		} else if (currentItem.id === 'my_services') {
			this.setState({ loading: true });
			await this.props.getServicesByEmail(this.props.email);
			this.setState({ loading: false });
			errorMessage =				'There is nothing in this list, Make sure that you create a Service from our Post screen, then you will be able to modify it here';
		}
	}

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
		backPressSubscriptions.add(() => this.props.navigation.pop());
	};

	onBackPress = async () => {
		await this.props.navigation.goBack();
	};

	renderServices = (service) => {
		if (service) {
			const {
				cardStyle,
				titleStyle,
				phoneLocationStyle,
				displayNameStyle,
				cardHeaderStyle,
				cardItemStyle
			} = styles;
			const displayDescription = service.description.substring(0, 30) + '...';

			let categoryName = service.category.split('_');
			for (let i = 0; i < categoryName.length; i++) {
				categoryName[i] = categoryName[i].charAt(0).toUpperCase() + categoryName[i].substring(1);
			}
			categoryName = categoryName.join(' ');
			return (
				<TouchableOpacity
					key={service.id}
					onPress={() => {
						this.props.selectService(service);
						this.props.navigation.navigate('service');
					}}
				>
					<Card style={cardStyle}>
						<CardItem header style={cardHeaderStyle}>
							<Text style={titleStyle}>{service.title}</Text>
							<Text style={displayNameStyle}>by: {service.displayName}</Text>
							<Text style={displayNameStyle}>Category: {categoryName}</Text>
						</CardItem>
						<CardItem style={cardItemStyle}>
							<Body style={phoneLocationStyle}>
								<Text>{service.phone}</Text>
								<Text style={{ marginLeft: '15%' }}>
									{/* {service.locationData.city} */}
								</Text>
							</Body>
							<Right>
								<Icon name="arrow-forward" style={{ color: '#FF7043' }} />
							</Right>
						</CardItem>
						<CardItem style={cardItemStyle}>
							<Body>
								<Text>{displayDescription}</Text>
							</Body>
						</CardItem>
					</Card>
				</TouchableOpacity>
			);
		}
		return (
			<EmptyListMessage buttonPress={this.onBackPress}>
				{errorMessage}
			</EmptyListMessage>
		);
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner color="orange" />;
		}
		return <View />;
	}

	renderListView = () => {
		if (this.state.loading) {
			return this.renderSpinner();
		}
		if (currentItem.id === 'favorites' && this.props.favorites.length > 0) {
			return (
				<FlatList
					data={this.props.favorites}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.title}
				/>
			);
		}
		if (currentItem.id === 'my_services') {
			return (
				<FlatList
					style={{ marginBottom: 40 }}
					data={this.props.servicesList}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.title}
				/>
			);
		}

		return (
			<EmptyListMessage buttonPress={this.onBackPress}>
				{errorMessage}
			</EmptyListMessage>
		);
	};

	render() {
		const { androidHeader, iosHeader } = styles;
		return (
			<Container>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'black' }}> {currentItem.title} </Title>
					</Body>
					<Right />
				</Header>
				{this.renderListView()}
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
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
	titleStyle: {
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
	return {
		favorites: state.favoriteServices,
		servicesList: state.serviceResult.servicesList,
		email: state.auth.email
	};
}

export default connect(
	mapStateToProps,
	{ getServicesByEmail, selectService }
)(ProfileServicesScreen);
