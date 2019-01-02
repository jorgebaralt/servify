import React, { Component } from 'react';
import {
	TouchableOpacity,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	View,
	SafeAreaView,
	Text,
	ActionSheetIOS,
	Platform,
	ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import {
	getServicesCategory,
	getServicesSubcategory,
	selectService,
	cancelAxiosServices,
} from '../../actions';
import EmptyListMessage from '../../components/ErrorMessage/EmptyListMessage';
import { pageHit } from '../../shared/ga_helper';
import { CustomHeader, DetailedServiceCard } from '../../components/UI';
import { colors } from '../../shared/styles';

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
	};

	async componentDidMount() {
		pageHit('Services List Screen');
		await this.decideGetService();
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	// Icon on left header
	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: 'white' }}
			onPress={() => {
				this.onBackPress();
			}}
		/>
	);

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

	// Handles click and render of action sheet
	// TODO: animate on scroll down dissapear, show on scroll up
	renderSortBy = () => {
		const { sortByStyle, iconSortStyle, viewSortStyle } = styles;
		// if there are services
		if (
			this.props.servicesList != null
			&& this.props.servicesList.length !== 0
			&& Platform.OS === 'ios'
		) {
			return (
				<View style={viewSortStyle}>
					<TouchableOpacity
						style={{ flexDirection: 'row', marginRight: 10 }}
						onPress={() => ActionSheetIOS.showActionSheetWithOptions(
								{
									options: sortByOptions,
									title:
										'How would you like to sort the services?',
									cancelButtonIndex: sortByOptions.length - 1
								},
								(selectedButtonIndex) => {
									if (
										selectedButtonIndex
										!== sortByOptions.length - 1
									) {
										this.setState({
											sortBy:
												sortByOptions[
													selectedButtonIndex
												]
										});
									}
									this.decideGetService();
								}
							)
						}
					>
						<Text style={sortByStyle}>
							Sort by: {this.state.sortBy}
						</Text>
						<Ionicons size={18} name="ios-arrow-down" style={iconSortStyle} />
					</TouchableOpacity>
				</View>
			);
		}
	};

	// Each service card
	renderServices = (service) => (
		<DetailedServiceCard
			service={service}
			onPress={() => {
				this.props.selectService(service);
				this.props.navigation.navigate('service');
			}}
			color={this.props.category.color[0]}
			distance={this.state.sortBy === DISTANCE}
		/>
	);
	
	// handles refresh control of services
	serviceListRefreshControl = () => (
		<RefreshControl
			refreshing={this.state.refreshing}
			onRefresh={() => this.decideGetService()}
			tintColor={this.props.category.color[0]}
			colors={[
				this.props.category.color[0],
				this.props.category.color[1]
			]}
		/>
	);

	renderListView() {
			if (this.props.servicesList.length !== 0) {
				return (
					<FlatList
						data={this.props.servicesList}
						renderItem={({ item }) => this.renderServices(item)}
						keyExtractor={(item) => item.title}
						enableEmptySections
						refreshControl={this.serviceListRefreshControl()}
					/>
				);
			}
			return (
				<EmptyListMessage buttonPress={this.onBackPress}>
					Unfortunetly there are no services published for this
					category, we are working on getting more people to publish
					services!
				</EmptyListMessage>
			);
	}

	renderContent = () => {
		if (this.state.dataLoaded) {
			// if it is category / subcategory
			if (this.props.category) {
				return (
					<View
						style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
					>
						{this.renderSortBy()}
						{this.renderListView()}
					</View>
				);
			}
			// else render the profile services
			return (
				<Text>This is profile services</Text>
			);
		}
		return (
			<ActivityIndicator
				style={{ marginTop: 20 }}
				size="large"
				color={this.props.category.color[0] || colors.primaryColor}
			/>
		);
	}

	render() {
		const { subcategory, category } = this.props;
		const mainColor = category ? category.color[0] : colors.white;

		return (
			<View style={{ flex: 1 }}>
				{/* Handles SafeAreaView background color */}
				<SafeAreaView
					style={{ flex: 0, backgroundColor: mainColor }}
				/>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: colors.white }}
				>
					<CustomHeader
						color={mainColor}
						title={subcategory ? subcategory.title : category.title}
						titleColor={colors.white}
						left={this.headerLeftIcon()}
					/>
					
						{this.renderContent()}
				</SafeAreaView>
			</View>
		);
	}
}

const styles = {
	viewSortStyle: {
		flexDirection: 'row-reverse',
		marginBottom: 10
	},
	sortByStyle: {
		color: 'gray',
		display: 'flex',
		marginRight: 0,
		marginTop: 10
	},
	iconSortStyle: {
		color: 'gray',
		marginTop: 10,
		marginLeft: 2
	}
};

const mapStateToProps = (state) => ({
	subcategory: state.selectedCategory.subcategory,
	category: state.selectedCategory.category,
	servicesList: state.serviceResult.servicesList,
	userLocation: state.location.data,
});

export default connect(
	mapStateToProps,
	{
		getServicesCategory,
		getServicesSubcategory,
		selectService,
		cancelAxiosServices,
	}
)(ServicesListScreen);
