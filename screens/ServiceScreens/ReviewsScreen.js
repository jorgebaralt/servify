import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	FlatList,
	ActivityIndicator,
	ScrollView,
	SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { CustomHeader, ReviewCard } from '../../components/UI';
import { colors } from '../../shared/styles';
import { cancelAxiosRating, getServiceReviews } from '../../api';

let willFocusSubscription;
let backPressSubscriptions;

class ReviewsScreen extends Component {
	state = { loading: true, reviews: null, service: this.props.navigation.getParam('service')};

	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);

		await getServiceReviews(this.state.service, (reviews) => this.setState({ loading: false, reviews }));
	}

	componentDidMount() {
		pageHit('Reviews Screen');
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

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={async () => {
				await cancelAxiosRating();
				this.props.navigation.goBack();
			}}
			disabled={this.state.loading}
		/>
	);

	renderReviewsList = (review) => <ReviewCard review={review} />;

	renderReviews = () => {
		if (this.state.reviews) {
			return (
				<FlatList
					style={{ paddingLeft: 20, paddingRight: 20 }}
					data={this.state.reviews}
					renderItem={({ item }) => this.renderReviewsList(item)}
					keyExtractor={(item) => item.reviewerEmail}
					enableEmptySections
				/>
			);
		}
	};

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					size="large"
					color="#FF7043"
					style={{ marginTop: 10 }}
				/>
			);
		}
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<CustomHeader title="Reviews" left={this.headerLeftIcon()} />
				<ScrollView style={{ flex: 1 }}>
					{this.renderSpinner()}
					{this.renderReviews()}
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = {
	commentDateStyle: {
		fontSize: 13,
		color: 'gray',
		marginTop: 0,
		marginLeft: 10
	},
	cardStyle: {
		width: '90%',
		marginLeft: '5%',
		marginTop: 10,
		shadowColor: null,
		shadowOffset: null,
		shadowOpacity: null,
		elevation: null,
		marginBottom: null
	}
};

export default ReviewsScreen;
