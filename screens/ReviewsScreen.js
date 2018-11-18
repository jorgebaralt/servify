import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, DeviceEventEmitter, FlatList, Platform } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import {
	Container,
	Header,
	Body,
	Right,
	Button,
	Icon,
	Title,
	Text,
	Left,
	Content,
	Spinner,
	CardItem,
	Card
} from 'native-base';
import { getServiceReviews, cancelAxiosRating } from '../actions';

let willFocusSubscription;
let backPressSubscriptions;

class ReviewsScreen extends Component {
	state = { loading: true };

	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);

		await this.props.getServiceReviews(this.props.service);
		this.setState({ loading: false });
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

	renderReviewsList = (review) => {
		const { commentDateStyle, cardStyle } = styles;
		const date = new Date(review.timestamp);
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		const day = date.getDate();
		const monthIndex = date.getMonth();
		const year = date.getFullYear();
		const reviewDate = day + ' ' + monthNames[monthIndex] + ' ' + year;

		return (
			<View>
				<Card style={cardStyle}>
					<CardItem>
						<Body>
							<Text style={{ fontSize: 15 }}>{review.reviewerDisplayName}</Text>
							<View style={{ marginLeft: -5, flexDirection: 'row' }}>
								<AirbnbRating
									showRating
									count={5}
									defaultRating={review.rating}
									size={15}
								/>
								<Text style={commentDateStyle}>{reviewDate}</Text>
							</View>
							<Text style={{ fontSize: 14, marginTop: 5, marginBottom: 5 }}>
								{review.comment}
							</Text>
						</Body>
					</CardItem>
				</Card>
			</View>
		);
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner color="orange" />;
		}
		return <View />;
	}

	renderReviews = () => {
		if (this.props.reviews) {
			return (
				<FlatList
					style={{ marginTop: 10, marginBottom: 40 }}
					data={this.props.reviews}
					renderItem={({ item }) => this.renderReviewsList(item)}
					keyExtractor={(item) => item.reviewerEmail}
					enableEmptySections
				/>
			);
		}
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
								this.props.navigation.goBack();
								this.props.cancelAxiosRating();
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
						<Title style={{ color: 'black' }}>Reviews</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					{this.renderSpinner()}
					{this.renderReviews()}
				</Content>
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
	commentDateStyle: {
		fontSize: 13,
		color: 'gray',
		marginTop: 3,
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

const mapStateToProps = (state) => ({
	reviews: state.ratings.serviceReviews,
	service: state.selectedService.service
});

export default connect(
	mapStateToProps,
	{ getServiceReviews, cancelAxiosRating }
)(ReviewsScreen);
