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
	Spinner,
	Content
} from 'native-base';
import { connect } from 'react-redux';
import {
	selectService,
} from '../../actions';
import { getServicesByEmail, getFavorites } from '../../api';
import EmptyListMessage from '../../components/ErrorMessage/EmptyListMessage';
import { pageHit } from '../../shared/ga_helper';

let errorMessage;
let currentItem;
let willFocusSubscription;
let backPressSubscriptions;

class ProfileServicesScreen extends Component {
	state = {
		loading: false,
		servicesList: null,
		favorites: null
	};

	async componentWillMount() {
		currentItem = this.props.navigation.getParam('item');
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			async () => {
				this.handleAndroidBack();
				await this.decideFetchData();
			}
		);
		
	}

	componentDidMount() {
		pageHit('Profile Services Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	decideFetchData = async () => {
		if (currentItem.id === 'favorites') {
			errorMessage =				'There is nothing in this list, Make sure that you add Services to Favorite by cliking on the top right icon, when looking at services.';
			this.setState({ loading: true });
			await getFavorites(this.props.user.email, (data) => this.setState({ favorites: data }));
			this.setState({ loading: false });
		} else if (currentItem.id === 'my_services') {
			errorMessage =				'There is nothing in this list, Make sure that you create a Service from our Post screen, then you will be able to modify it here';
			this.setState({ loading: true });
			await getServicesByEmail(this.props.user.email, (data) => this.setState({servicesList: data}) );
			this.setState({ loading: false });
		}
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
		const {
			cardStyle,
			titleStyle,
			phoneLocationStyle,
			displayNameStyle,
			cardHeaderStyle,
			cardItemStyle
		} = styles;
		const displayDescription = service.description.substring(0, 25) + '...';

		let categoryName = service.category.split('_');
		for (let i = 0; i < categoryName.length; i++) {
			categoryName[i] =				categoryName[i].charAt(0).toUpperCase() + categoryName[i].substring(1);
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
							<Icon
								name="ios-arrow-forward"
								type="Ionicons"
								style={{ color: '#FF7043' }}
							/>
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
		if (
			currentItem.id === 'favorites'
			&& this.state.favorites
			&& this.state.favorites.length > 0
		) {
			return (
				<Content>
					<FlatList
						data={this.state.favorites}
						renderItem={({ item }) => this.renderServices(item)}
						keyExtractor={(item) => item.title}
					/>
				</Content>
			);
		}
		if (
			currentItem.id === 'my_services'
			&& this.state.servicesList
			&& this.state.servicesList.length > 0
		) {
			return (
				<Content>
					<FlatList
						style={{ marginBottom: 40 }}
						data={this.state.servicesList}
						renderItem={({ item }) => this.renderServices(item)}
						keyExtractor={(item) => item.title}
					/>
				</Content>
			);
		}
		return (
			<EmptyListMessage buttonPress={this.onBackPress}>
				{errorMessage}
			</EmptyListMessage>
		);
	};

	render() {
		const { androidHeader, iosHeader, androidTitle, iosTitle } = styles;
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
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'black' }}
							/>
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={Platform.Os === 'android' ? androidTitle : iosTitle}>
							{' '}
							{currentItem.title}{' '}
						</Title>
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
	iosTitle: {
		color: 'black'
	},
	androidTitle: {
		color: 'black',
		marginLeft: 10
	},
	cardStyle: {
		width: '80%',
		marginLeft: '10%',
		marginTop: '2.5%',
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		height: 165,
		borderRadius: 8
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
		color: 'white',
		borderRadius: 8
	},
	cardHeaderStyle: {
		flexDirection: 'column',
		display: 'flex',
		alignItems: 'flex-start',
		borderRadius: 8
	},
	displayNameStyle: {
		fontSize: 14,
		fontWeight: undefined
	},
	cardItemStyle: {
		marginTop: -10,
		borderRadius: 8
	}
};

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(
	mapStateToProps,
	{
		selectService,
	}
)(ProfileServicesScreen);
