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
import EmptyListMessage from '../../components/ErrorMessage/EmptyListMessage';
import { pageHit } from '../../shared/ga_helper';
import { CustomHeader, DetailedServiceCard } from '../../components/UI';
import { colors } from '../../shared/styles';
import { getServicesCategory, getServicesSubcategory, cancelAxios } from '../../api';

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
		sortBy: DISTANCE,
		category: null,
		subcategory: null,
		servicesList: null
	};

	async componentWillMount(){
		await this.setState({
			category: this.props.navigation.getParam('category'),
			subcategory: this.props.navigation.getParam('subcategory')
		});
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			async () => {
				this.handleAndroidBack();
				await this.fetchData();
			}
		);
	}

	async componentDidMount() {
		await this.decideGetService();
	}

	componentWillUnmount() {
		pageHit('Services list screen');
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

	onBackPress = async () => {
		await cancelAxios();
		this.props.navigation.goBack(null);
	};

	decideGetService = async () => {
		this.setState({ refreshing: true });
		if (this.props.userLocation) {
			await this.fetchData();
		}
	};

	fetchData = async () => {
		const { category, subcategory } = this.state;
		const categoryRef = category.dbReference;
		if (subcategory) {
			const subcategoryRef = subcategory.dbReference;
			await getServicesSubcategory(
				subcategoryRef,
				this.props.userLocation,
				this.state.sortBy,
				(data) => this.setState({ servicesList: data, dataLoaded: true, refreshing: false })
			);
		} else {
			await getServicesCategory(
				categoryRef,
				this.props.userLocation,
				this.state.sortBy,
				(data) => this.setState({ servicesList: data, dataLoaded: true, refreshing: false })
			);
		}
	}

	// TODO: sorting function here, after actin sheet **** IMPORTANT ****

	// Handles click and render of action sheet
	// TODO: animate on scroll down dissapear, show on scroll up
	renderSortBy = () => {
		const { sortByStyle, iconSortStyle, viewSortStyle } = styles;
		// if there are services
		if (
			this.state.servicesList != null
			&& this.state.servicesList.length !== 0
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
						<Ionicons
							size={18}
							name="ios-arrow-down"
							style={iconSortStyle}
						/>
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
				this.props.navigation.navigate('service', { service });
			}}
			color={this.state.category.color[0]}
			distance={this.state.sortBy === DISTANCE}
		/>
	);

	// handles refresh control of services
	serviceListRefreshControl = () => (
		<RefreshControl
			refreshing={this.state.refreshing}
			onRefresh={() => this.fetchData()}
			tintColor={this.state.category.color[0]}
			colors={[
				this.state.category.color[0],
				this.state.category.color[1]
			]}
		/>
	);

	renderListView() {
		if (this.state.servicesList.length !== 0) {
			return (
				<FlatList
					data={this.state.servicesList}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.title}
					enableEmptySections
					refreshControl={this.serviceListRefreshControl()}
				/>
			);
		}
		return (
			<EmptyListMessage buttonPress={this.onBackPress}>
				Unfortunetly there are no services published for this category,
				we are working on getting more people to publish services!
			</EmptyListMessage>
		);
	}

	renderContent = () => {
		if (this.state.dataLoaded) {
			// if it is category / subcategory
			if (this.state.category) {
				return (
					<View
						style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
					>
						{this.renderSortBy()}
						{this.renderListView()}
					</View>
				);
			}
		}
		return (
			<ActivityIndicator
				style={{ marginTop: 20 }}
				size="large"
				color={this.state.category.color[0] || colors.primaryColor}
			/>
		);
	};

	render() {
		const { category, subcategory } = this.state;
		const mainColor = category ? category.color[0] : colors.white;

		return (
			<View style={{ flex: 1 }}>
				{/* Handles SafeAreaView background color */}
				<SafeAreaView style={{ flex: 0, backgroundColor: mainColor }} />
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
	userLocation: state.location.data
});

export default connect(
	mapStateToProps,
)(ServicesListScreen);
