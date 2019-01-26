import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	Text,
	ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { getServicesByUid, getFavorites, removeFavorite, cancelAxiosFavs } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';
import {
	CustomHeader,
	ProfileServiceCard,
	InfoImage,
	Button
} from '../../components/UI';
import { defaultImage } from '../../assets/default/categories';

let currentItem;
let willFocusSubscription;
let backPressSubscriptions;

class ProfileServicesScreen extends Component {
	state = {
		loading: false,
		myServices: null,
		favorites: null
	};

	async componentWillMount() {
		currentItem = this.props.navigation.getParam('item');
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			async () => {
				this.handleAndroidBack();
				this.decideFetchData();
			}
		);
	}

	async componentDidMount() {
		pageHit('Profile Services Screen');
		await this.decideFetchData();
	}

	async componentWillUnmount() {
		if (currentItem.id === 'favorites') {
			await cancelAxiosFavs();
		}
		
		willFocusSubscription.remove();
	}

	decideFetchData = async () => {
		this.setState({ loading: true });
		await this.refreshData();
		this.setState({ loading: false });
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
		await this.props.navigation.goBack();
	};

	refreshData = async () => {
		if (currentItem.id === 'favorites') {
			await getFavorites(this.props.user.uid, (data) => this.setState({ favorites: data }));
		} else if (currentItem.id === 'my_services') {
			await getServicesByUid(this.props.user.uid, (data) => this.setState({ myServices: data }));
		}
	};

	removeFavorite = async (service) => {
		this.setState({ loading: true });
		await removeFavorite(this.props.user.uid, service.id);
		await this.refreshData();
		this.setState({ loading: false });
	};

	editService = (service) => {
		this.props.navigation.navigate('editService', { service });
	};

	renderServices = (service) => (
		<ProfileServiceCard
			service={service}
			type={currentItem.id}
			currentUser={this.props.user}
			image={service.imagesInfo ? (service.imagesInfo[0] ? service.imagesInfo[0].url : defaultImage(service.category)) : defaultImage(service.category)}
			uri={service.imagesInfo ? (service.imagesInfo.length > 0 ? service.imagesInfo[0].url : null) : null}
			onPress={() => {
				this.props.navigation.navigate('service', { service });
			}}
			onRemoveFavorite={async () => {
				await this.removeFavorite(service);
			}}
			onEditService={() => this.editService(service)}
		/>
	);

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => {
				this.onBackPress();
			}}
		/>
	);

	flatListRefreshControl = () => (
		<RefreshControl
			refreshing={this.state.loading}
			onRefresh={async () => this.refreshData()}
			tintColor={colors.primaryColor}
			colors={[colors.primaryColor]}
		/>
	);

	decideRenderData = () => {
		let data;
		if (this.state.favorites || this.state.myServices) {
			if (
				currentItem.id === 'favorites'
				&& this.state.favorites.length > 0
			) {
				data = this.state.favorites;
			} else if (
				currentItem.id === 'my_services'
				&& this.state.myServices.length > 0
			) {
				data = this.state.myServices;
			} else if (
				currentItem.id === 'favorites'
				&& this.state.favorites < 1
			) {
				// Empty favorites
				return (
					<ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text style={{ fontSize: 18, marginTop: 10, color: colors.black }}>
							You have not added any service to favorite list,
							press below to browse some services, if you see
							something you like, you can add it to favorite
						</Text>
						<View style={{ height: 300, marginTop: 10 }}>
							<InfoImage
								image={require('../../assets/backgrounds/plant.jpg')}
								style={{
									marginTop: 5,
									height: 250,
									marginBottom: 20
								}}
								rounded
								onPress={() => this.props.navigation.navigate('browse')
								}
							>
								<View
									style={{
										position: 'absolute',
										left: 20,
										bottom: 20,
										right: 5
									}}
								>
									<Text
										style={{
											fontSize: 30,
											fontWeight: '600',
											color: colors.secondaryColor,
											marginBottom: 80
										}}
									>
										Search for services
									</Text>
									<Button
										bordered
										color={colors.secondaryColor}
										textColor={colors.secondaryColor}
										style={{ fontSize: 20 }}
										onPress={() => this.props.navigation.navigate(
												'browse'
											)
										}
									>
										<Text>Browse</Text>
									</Button>
								</View>
							</InfoImage>
						</View>
					</ScrollView>
				);
			} else if (
				currentItem.id === 'my_services'
				&& this.state.myServices < 1
			) {
				// Empty my services
				return (
					<ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text style={{ fontSize: 18, marginTop: 10, color: colors.black }}>
							You have not created any service yet, click bellow
							to create your first service
						</Text>
						<View style={{ height: 300, marginTop: 10 }}>
							<InfoImage
								image={require('../../assets/backgrounds/plant2.jpg')}
								style={{
									marginTop: 5,
									height: 250,
									marginBottom: 20
								}}
								rounded
								onPress={() => this.props.navigation.navigate(
										'publishInfo'
									)
								}
							>
								<View
									style={{
										position: 'absolute',
										left: 20,
										bottom: 20,
										right: 20,
										justifyContent: 'flex-end'
									}}
								>
									<Text
										style={{
											fontSize: 30,
											fontWeight: '600',
											color: colors.primaryColor,
											marginBottom: 80,
											alignSelf: 'flex-end'
										}}
									>
										Create a service
									</Text>
									<Button
										bordered
										color={colors.primaryColor}
										textColor={colors.primaryColor}
										style={{
											fontSize: 20,
											alignSelf: 'flex-end'
										}}
										onPress={() => this.props.navigation.navigate(
												'publishInfo'
											)
										}
									>
										<Text>Create</Text>
									</Button>
								</View>
							</InfoImage>
						</View>
					</ScrollView>
				);
			}
			return (
				<FlatList
					data={data}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.id}
					refreshControl={this.flatListRefreshControl()}
					style={{ paddingLeft: 20, paddingRight: 20 }}
				/>
			);
		}

		return this.renderSpinner();
	};

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 20 }}
					size="large"
					color={colors.primaryColor}
				/>
			);
		}
		return <View />;
	}

	render() {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: colors.white }}
				forceInset={{ bottom: 'never' }}
			>
				<CustomHeader
					left={this.headerLeftIcon()}
					title={currentItem.title}
				/>
				<View
					style={{
						flex: 1,
						backgroundColor: colors.white,
						zIndex: -1
					}}
				>
					{this.decideRenderData()}
				</View>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(mapStateToProps)(ProfileServicesScreen);
