import React, { Component } from 'react';
import {
	ListView,
	TouchableOpacity,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	View
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
	ActionSheet
} from 'native-base';
import { AirbnbRating } from 'react-native-ratings';
import { connect } from 'react-redux';
import {
	getServicesCategory,
	getServicesSubcategory,
	selectService,
	cancelAxiosServices
} from '../actions';
import EmptyListMessage from '../components/EmptyListMessage';

let willFocusSubscription;
let backPressSubscriptions;
const DISTANCE = 'Distance';
const POPULARITY = 'Popularity';
const NEWEST = 'Newest';
const OLDEST = 'Oldest';
const sortByOptions = [DISTANCE, POPULARITY, NEWEST, OLDEST, 'Cancel'];

class ServicesListScreen extends Component {
	state = {
		dataLoaded: undefined,
		refreshing: false,
		sortBy: DISTANCE
	};

	componentWillMount = async () => {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.handleAndroidBack();
			}
		);
		await this.decideGetService();
	};

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

	onBackPress = () => {
		this.props.cancelAxiosServices();
		this.props.navigation.goBack(null);
	};

	decideGetService = async () => {
		this.setState({ refreshing: true });
		const { category, subcategory } = this.props;
		const categoryRef = category.dbReference;
		if (this.props.userLocation) {
			if (subcategory) {
				const subcategoryRef = subcategory.dbReference;
				await this.props.getServicesSubcategory(
					subcategoryRef,
					this.props.userLocation,
					this.state.sortBy
				);
			} else {
				await this.props.getServicesCategory(
					categoryRef,
					this.props.userLocation,
					this.state.sortBy
				);
			}
		}
		this.setState({ dataLoaded: true, refreshing: false });
	};

	renderRating = (service) => {
		if (service.ratingCount > 0) {
			return (
				<Text>{(service.ratingSum / service.ratingCount).toFixed(1)}</Text>
			);
		}
		return <Text>(0)</Text>;
	};

	renderMilesToService = (service) => {
		if (this.state.sortBy === 'Distance' && service.distance) {
			return (
				<Right>
					<Text style={{ color: 'gray' }}>
						{Math.floor(service.distance)} mile(s)
					</Text>
				</Right>
			);
		}
	};

	renderServices = (service) => {
		const {
			cardStyle,
			titleStyle,
			phoneLocationStyle,
			displayNameStyle,
			cardHeaderStyle,
			cardItemStyle,
			reviewLocationStyle
		} = styles;

		const displayDescription = service.description.substring(0, 30) + '...';
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.selectService(service);
					this.props.navigation.navigate('service');
				}}
			>
				<Card style={cardStyle}>
					<CardItem header style={cardHeaderStyle}>
						<Text style={titleStyle}>{service.title}</Text>
						<View style={reviewLocationStyle}>
							<Text style={displayNameStyle}>by: {service.displayName}</Text>
							<View style={{ justifyContent: 'flex-end', marginTop: -3 }}>
								<AirbnbRating
									count={5}
									defaultRating={service.ratingSum / service.ratingCount}
									size={15}
								/>
							</View>
							<Text
								style={[displayNameStyle, { marginTop: -2, marginLeft: 3 }]}
							>
								{this.renderRating(service)}
							</Text>
						</View>
					</CardItem>
					<CardItem style={cardItemStyle}>
						<Body style={phoneLocationStyle}>
							<Text>{service.phone}</Text>
							<Text style={{ marginLeft: '5%' }}>
								{service.locationData.city}
							</Text>
						</Body>
						<Right>
							<Icon
								name="ios-arrow-forward"
								type="Ionicons"
								style={{ color: this.props.category.color[0] }}
							/>
						</Right>
					</CardItem>
					<CardItem style={cardItemStyle}>
						<Body>
							<Text>{displayDescription}</Text>
						</Body>
						{this.renderMilesToService(service)}
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	};

	renderListView() {
		const { sortByStyle, iconSortStyle, viewSortStyle } = styles;
		if (this.state.dataLoaded) {
			if (this.props.servicesList && this.props.servicesList.length !== 0) {
				return (
					<View>
						<TouchableOpacity
							style={viewSortStyle}
							onPress={() => ActionSheet.show(
									{
										options: sortByOptions,
										title: 'How would you like to sort the services?',
										cancelButtonIndex: sortByOptions.length - 1
									},
									(selectedButtonIndex) => {
										if (selectedButtonIndex !== sortByOptions.length - 1) {
											this.setState({
												sortBy: sortByOptions[selectedButtonIndex]
											});
										}
										this.decideGetService();
									}
								)
							}
						>
							<Text style={sortByStyle}>Sort by: {this.state.sortBy}</Text>
							<Icon name="ios-arrow-down" style={iconSortStyle} />
						</TouchableOpacity>
						<FlatList
							style={{ marginTop: 10, marginBottom: 40, height: '100%' }}
							data={this.props.servicesList}
							renderItem={({ item }) => this.renderServices(item)}
							keyExtractor={(item) => item.title}
							enableEmptySections
							refreshControl={(
<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={() => this.decideGetService()}
									tintColor={this.props.category.color[0]}
									colors={[
										this.props.category.color[0],
										this.props.category.color[1]
									]}
/>
)}
						/>
					</View>
				);
			}
			return (
				<EmptyListMessage buttonPress={this.onBackPress}>
					Unfortunetly there are no services posted for this category, we are
					working on getting more people to post services!
				</EmptyListMessage>
			);
		}
		return <Spinner color={this.props.category.color[0]} />;
	}

	render() {
		const { headerTitleStyle } = styles;
		const { subcategory, category } = this.props;
		return (
			<Container>
				<Header style={{ backgroundColor: category.color[0] }}>
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
								style={{ color: 'white' }}
							/>
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={headerTitleStyle}>
							{subcategory ? subcategory.title : category.title}
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
	headerStyle: {},
	cardStyle: {
		width: '90%',
		marginLeft: '5%',
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
	reviewLocationStyle: {
		marginTop: 10,
		diaplay: 'flex',
		flexDirection: 'row'
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
		color: 'black'
	},
	cardItemStyle: {
		marginTop: -10
	},
	viewSortStyle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: '5%'
	},
	sortByStyle: {
		color: 'gray',
		display: 'flex',
		marginRight: 0,
		marginTop: 10
	},
	iconSortStyle: {
		color: 'gray',
		fontSize: 20,
		marginTop: 10,
		marginLeft: 2
	}
};

const mapStateToProps = (state) => ({
	subcategory: state.selectedCategory.subcategory,
	category: state.selectedCategory.category,
	servicesList: state.serviceResult.servicesList,
	userLocation: state.auth.location
});

export default connect(
	mapStateToProps,
	{
		getServicesCategory,
		getServicesSubcategory,
		selectService,
		cancelAxiosServices
	}
)(ServicesListScreen);
