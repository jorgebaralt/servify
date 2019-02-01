/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
	TouchableOpacity,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	View,
	Text,
	ActionSheetIOS,
	Platform,
	ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import EmptyListMessage from '../../components/ErrorMessage/EmptyListMessage';
import { pageHit } from '../../shared/ga_helper';
import { CustomHeader, DetailedServiceCard } from '../../components/UI';
import { colors } from '../../shared/styles';
import {
	getServicesCategory,
	getServicesSubcategory,
	cancelAxios,
	sortServices
} from '../../api';
import { defaultImage } from '../../assets/default/categories';

let willFocusSubscription;
let backPressSubscriptions;
const DISTANCE = 'Distance';
const POPULARITY = 'Popularity';
const NEWEST = 'Newest';
const OLDEST = 'Oldest';
const sortByOptions = [DISTANCE, POPULARITY, NEWEST, OLDEST, 'Cancel'];

class ServicesListScreen extends Component {
	state = {
		loading: true,
		refreshing: false,
		sortBy: DISTANCE,
		category: null,
		subcategory: null,
		servicesList: null
	};

	async componentWillMount() {
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

	headerRightIcon = () => this.renderSortBy();

	// Handles click and render of action sheet
	renderSortBy = () => {
		const { sortByStyle, iconSortStyle, viewSortStyle } = styles;
		// if there are services
		if (
			this.state.servicesList != null
			&& this.state.servicesList.length !== 0
			&& Platform.OS === 'ios'
		) {
			return (
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 10
					}}
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
											sortByOptions[selectedButtonIndex]
									});
								}
								this.sortServices();
							}
						)
					}
				>
					<Text style={{ fontSize: 14, color: colors.white }}>
						{this.state.sortBy}
					</Text>
					<Ionicons
						size={16}
						name="ios-arrow-down"
						style={styles.iconSortStyle}
					/>
				</TouchableOpacity>
			);
		}
	};

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

	sortServices = async () => {
		const sortedServices = await sortServices(
			this.state.servicesList,
			this.state.sortBy,
			this.props.userLocation
		);
		this.setState({ servicesList: sortedServices });
	};

	fetchData = async () => {
		const { category, subcategory } = this.state;
		const categoryRef = category.dbReference;
		if (subcategory) {
			const subcategoryRef = subcategory.dbReference;
			await getServicesSubcategory(
				subcategoryRef,
				this.props.userLocation,
				(data) => this.setState({
						servicesList: data,
						loading: false,
						refreshing: false
					})
			);
		} else {
			await getServicesCategory(
				categoryRef,
				this.props.userLocation,
				(data) => this.setState({
						servicesList: data,
						loading: false,
						refreshing: false
					})
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
			uri={
				service.imagesInfo
					? service.imagesInfo[0].url
						? service.imagesInfo[0].url
						: defaultImage(service.category)
					: defaultImage(service.category)
			}
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
		if (this.state.servicesList != null) {
			if (this.state.servicesList.length === 0) {
				return (
					<EmptyListMessage buttonPress={this.onBackPress}>
						Unfortunetly there are no services published for this
						category, we are working on getting more people to
						publish services!
					</EmptyListMessage>
				);
			}
			return (
				<FlatList
					data={this.state.servicesList}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.id}
					enableEmptySections
					refreshControl={this.serviceListRefreshControl()}
				/>
			);
		}
	}

	renderContent = () => {
		if (this.state.category) {
			return (
				<View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
					{this.renderListView()}
				</View>
			);
		}
	};

	renderSpinner = () => {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 20 }}
					size="large"
					color={this.state.category.color[0] || colors.primaryColor}
				/>
			);
		}
	};

	render() {
		const { category, subcategory } = this.state;
		const mainColor = category ? category.color[0] : colors.white;

		return (
			<View style={{ flex: 1 }}>
				{/* Handles SafeAreaView background color */}
				<SafeAreaView
					style={{ flex: 0, backgroundColor: mainColor }}
					forceInset={{ bottom: 'never' }}
				/>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: colors.white }}
					forceInset={{ bottom: 'never' }}
				>
					<CustomHeader
						color={mainColor}
						title={subcategory ? subcategory.title : category.title}
						titleColor={colors.white}
						left={this.headerLeftIcon()}
						right={this.headerRightIcon()}
					/>
					{this.renderSpinner()}
					{this.renderContent()}
				</SafeAreaView>
			</View>
		);
	}
}

const styles = {
	iconSortStyle: {
		color: colors.white,
		marginLeft: 2,
		marginTop: 1
	}
};

const mapStateToProps = (state) => ({
	userLocation: state.location.data
});

export default connect(mapStateToProps)(ServicesListScreen);
