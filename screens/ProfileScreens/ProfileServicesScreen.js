import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { getServicesByEmail, getFavorites, removeFavorite } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';
import { CustomHeader, ProfileServiceCard } from '../../components/UI';

let currentItem;
let willFocusSubscription;
let backPressSubscriptions;

class ProfileServicesScreen extends Component {
	state = {
		loading: false,
		myServices: null,
		favorites: null,
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

	componentWillUnmount() {
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
			await getFavorites(this.props.user.email, (data) => this.setState({ favorites: data }));
		} else if (currentItem.id === 'my_services') {
			await getServicesByEmail(this.props.user.email, (data) => this.setState({ myServices: data }));
		}
	};

	removeFavorite = async (service) => {
		this.setState({ loading: true });
		await removeFavorite(this.props.user.email, service);
		await this.refreshData();
		this.setState({ loading: false });
	};

	editService = (service) => {
		this.props.navigation.navigate('editService', { service });
	}

	renderServices = (service) => (
		<ProfileServiceCard
			service={service}
			type={currentItem.id}
			currentUser={this.props.user}
			image={require('../../assets/default/subcategories/home_cleaning.jpg')}
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
			}
			if (
				currentItem.id === 'my_services'
				&& this.state.myServices.length > 0
			) {
				data = this.state.myServices;
			}
			return (
				<FlatList
					data={data}
					renderItem={({ item }) => this.renderServices(item)}
					keyExtractor={(item) => item.title}
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

export default connect(
	mapStateToProps,
)(ProfileServicesScreen);
