import React, { Component } from 'react';
import {
	View,
	Dimensions,
	Platform,
	KeyboardAvoidingView,
	DeviceEventEmitter,
	FlatList,
	Alert,
	TouchableOpacity
} from 'react-native';
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
	Card,
	CardItem,
	Textarea,
	Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { MapView, Linking } from 'expo';
import { AnimatedRegion, Animated } from 'react-native-maps';
import {
	addFavorite,
	submitReview,
	getReviews,
	resetReview,
	deleteReview,
	removeFavorite,
	cancelAxiosRating
} from '../actions';
import { pageHit } from '../shared/ga_helper';
import StarsRating from '../components/Ratings/StarsRating';
import StarsRatingPick from '../components/Ratings/StarsRatingPick';
import DollarRatingPick from '../components/Ratings/DollarRatingPick';

const SCREEN_WIDTH = Dimensions.get('window').width;
const maxCharCount = 100;

let coords;
let meters;
let latitudeDelta;
let fixedRegion;
let willFocusSubscription;
let backPressSubscriptions;

class SpecificServiceScreen extends Component {
	state = {
		isFav: false,
		favLoading: false,
		region: undefined,
		comment: '',
		commentCharCount: maxCharCount,
		starCount: 0,
		dollarCount: 0,
		loadingUserComment: false
	};

	componentWillMount = async () => {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.handleAndroidBack();
			}
		);

		const { service } = this.props;

		const { latitude, longitude } = service.geolocation;
		coords = { latitude, longitude };
		meters = service.miles * 1609.34;
		latitudeDelta = 0.0922;

		// Map according to miles around the service
		if (service.miles <= 3) {
			latitudeDelta = 0.0799;
		} else if (service.miles <= 10 && service.miles > 3) {
			latitudeDelta = 0.45;
		} else if (service.miles <= 30 && service.miles > 10) {
			latitudeDelta = 0.8;
		} else if (service.miles <= 60 && service.miles > 30) {
			latitudeDelta = 2;
		}
		fixedRegion = {
			latitude,
			longitude,
			latitudeDelta,
			longitudeDelta: 0.0421
		};

		this.setState({
			region: new AnimatedRegion(fixedRegion),
			loadingUserComment: true
		});
		if (service.favUsers.includes(this.props.currentUserEmail)) {
			this.setState({ isFav: true });
		}

		await this.props.getReviews(service, this.props.currentUserEmail);
		this.setState({ loadingUserComment: false });
	};

	componentDidMount() {
		pageHit('Specific Service Screen');
	}

	componentWillUnmount() {
		this.props.cancelAxiosRating();
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
		backPressSubscriptions.add(() => {
			this.props.navigation.pop();
			this.props.cancelAxiosRating();
		});
	};

	onBackPress = async () => {
		await this.props.resetReview();
		this.props.cancelAxiosRating();
		this.props.navigation.goBack();
	};

	addFavorite = async (email) => {
		this.setState({ isFav: true });
		await this.props.addFavorite(email, this.props.service);
	};

	removeFavorite = async (email) => {
		this.setState({ isFav: false });
		await this.props.removeFavorite(email, this.props.service);
	};

	favPressed = async () => {
		this.setState({ favLoading: true });
		const { currentUserEmail } = this.props;
		if (this.state.isFav) {
			await this.removeFavorite(currentUserEmail);
		} else {
			await this.addFavorite(currentUserEmail);
		}
		this.setState({ favLoading: false });
	};

	callPressed = async () => {
		const { phone } = this.props.service;
		await Linking.openURL('tel:+1' + phone.replace(/\D/g, ''));
	};

	openEmail = async () => {
		Linking.openURL(`mailto:${this.props.service.email}`);
	};

	reportAlert = () => {
		Alert.alert('Report', 'Do you want to report this service?', [
			{
				text: 'Report',
				onPress: () => this.props.navigation.navigate('report')
			},
			{
				text: 'Cancel'
			}
		]);
	};

	renderIcon = () => {
		if (this.props.currentUserEmail === this.props.service.email) {
			return (
				<Icon
					type="Entypo"
					name="dots-three-horizontal"
					style={{ color: 'black' }}
					onPress={() => this.props.navigation.navigate('editService')
					}
				/>
			);
		}
		return (
			<View style={{ flexDirection: 'row' }}>
				<Icon
					type="MaterialIcons"
					name="info-outline"
					style={{
						color: 'black',
						fontSize: 26,
						marginLeft: 5,
						marginRight: 10
					}}
					onPress={() => this.reportAlert()}
					disabled={this.state.favLoading}
				/>
				<Icon
					type="MaterialIcons"
					name={this.state.isFav ? 'favorite' : 'favorite-border'}
					style={{ color: '#D84315', fontSize: 26 }}
					onPress={() => this.favPressed()}
					disabled={this.state.favLoading}
				/>
			</View>
		);
	};

	renderSubcategoryName = () => {
		const { service } = this.props;
		const { descriptionStyle } = styles;
		if (service.subcategory) {
			let subcategoryName = service.subcategory.split('_');
			for (let i = 0; i < subcategoryName.length; i++) {
				subcategoryName[i] =					subcategoryName[i].charAt(0).toUpperCase()
					+ subcategoryName[i].substring(1);
			}
			subcategoryName = subcategoryName.join(' ');
			return <Text style={descriptionStyle}> - {subcategoryName}</Text>;
		}
	};

	commentChangeText = (text) => {
		this.setState({
			comment: text,
			commentCharCount: maxCharCount - text.length
		});
	};

	submitReview = async () => {
		this.setState({ loadingUserComment: true });
		if (this.state.starCount > 0) {
			const review = {
				rating: this.state.starCount,
				comment: this.state.comment,
				reviewerDisplayName: this.props.displayName,
				reviewerEmail: this.props.currentUserEmail
			};
			await this.props.submitReview(this.props.service, review);
			this.setState({ loadingUserComment: false });
		}
	};

	renderCommentDate = (currentUserReview) => {
		const date = new Date(currentUserReview.timestamp);
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

		if (currentUserReview.timestamp) {
			return (
				<Text style={{ color: 'gray', marginTop: -5, fontSize: 14 }}>
					{reviewDate}
				</Text>
			);
		}
		return (
			<Text style={{ color: 'gray', marginTop: -5, fontSize: 14 }}>
				a moment ago
			</Text>
		);
	};

	deleteComment = async () => {
		this.setState({ loadingUserComment: true });
		await this.props.deleteReview(
			this.props.service,
			this.props.currentUserReview
		);
		this.setState({ loadingUserComment: false });
	};

	openAlert = () => {
		Alert.alert('Delete', 'Do you want to delete your review?', [
			{
				text: 'Delete',
				onPress: () => this.deleteComment()
			},
			{
				text: 'Cancel'
			}
		]);
	};

	// Current user review
	renderCurrentUserReview = () => {
		const {
			cardStyle,
			textAreaStyle,
			charCountStyle,
			subtitleStyle,
			commentDateStyle
		} = styles;
		const { currentUserReview } = this.props;
		if (this.state.loadingUserComment) {
			return <Spinner color="orange" />;
		}
		if (this.props.currentUserEmail !== this.props.service.email) {
			// User have not added a review yet
			if (!currentUserReview) {
				return (
					<View>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text style={{ fontSize: 17 }}>
										{this.props.displayName}
									</Text>
									<View style={{ marginTop: 10 }}>
										<StarsRatingPick
											width={30}
											height={30}
											spacing={5}
											rating={this.state.starCount}
											selectRating={(count) => this.setState({ starCount: count })}
										/>
									</View>
									<View style={{ marginTop: 10 }}>
										<DollarRatingPick rating={this.state.dollarCount} selectRating={(count) => this.setState({ dollarCount: count })} />
									</View>
									<Textarea
										style={textAreaStyle}
										rowSpan={2}
										placeholder="Add your comments here"
										maxLength={maxCharCount}
										value={this.state.comment}
										onChangeText={(text) => this.commentChangeText(text)
										}
									/>
									<Text style={charCountStyle}>
										{this.state.commentCharCount}
									</Text>
								</Body>
							</CardItem>
						</Card>
						<Button
							bordered
							style={{ marginLeft: '60%', marginTop: 0 }}
							onPress={() => this.submitReview()}
							disabled={this.state.starCount === 0}
						>
							<Text style={{ fontSize: 15 }}>Submit review</Text>
						</Button>
					</View>
				);
			}
			// User sees his own review
			return (
				<View>
					<Text style={subtitleStyle}>Your review</Text>
					<Card style={cardStyle}>
						<CardItem>
							<Icon
								name="dots-three-horizontal"
								type="Entypo"
								style={{
									position: 'absolute',
									right: 0,
									top: 0,
									color: 'gray'
								}}
								onPress={() => this.openAlert()}
							/>

							<Body>
								<Text style={{ fontSize: 15 }}>
									{this.props.displayName}
								</Text>
								<View
									style={{
										marginLeft: 0,
										flexDirection: 'row'
									}}
								>
									<StarsRating
										width={20}
										height={20}
										spacing={5}
										rating={currentUserReview.rating}
									/>
									<Text style={commentDateStyle}>
										{this.renderCommentDate(
											currentUserReview
										)}
									</Text>
								</View>
								<Text style={{ fontSize: 14, marginTop: 5 }}>
									{currentUserReview.comment}
								</Text>
							</Body>
						</CardItem>
					</Card>
				</View>
			);
		}
	};

	renderReviews = (review) => {
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
				<Card style={[cardStyle, { marginBottom: 2 }]}>
					<CardItem>
						<Body>
							<Text style={{ fontSize: 15 }}>
								{review.reviewerDisplayName}
							</Text>
							<View style={{ flexDirection: 'row' }}>
								<StarsRating
									width={15}
									height={15}
									spacing={5}
									rating={review.rating}
								/>
								<Text style={commentDateStyle}>
									{reviewDate}
								</Text>
							</View>
							<Text style={{ fontSize: 14, marginTop: 5 }}>
								{review.comment}
							</Text>
						</Body>
					</CardItem>
				</Card>
			</View>
		);
	};

	renderAllReviews = () => {
		const { subtitleStyle } = styles;
		if (this.props.reviews) {
			if (this.props.reviews.length !== 0) {
				return (
					<View>
						<Text style={subtitleStyle}>All reviews</Text>
						<FlatList
							style={{ marginTop: 10 }}
							data={this.props.reviews}
							renderItem={({ item }) => this.renderReviews(item)}
							keyExtractor={(item) => item.reviewerEmail}
							enableEmptySections
						/>
						{this.showMoreComments()}
					</View>
				);
			}
		}
	};

	showMoreComments = () => {
		const { showMoreStyle } = styles;
		return (
			<View style={{ marginTop: 10, marginBottom: 40 }}>
				<Text
					style={showMoreStyle}
					onPress={() => this.props.navigation.navigate('reviews')}
				>
					Show more
				</Text>
			</View>
		);
	};

	renderRatingAvg = () => {
		if (this.props.service) {
			return (
				<TouchableOpacity
					onPress={() => this.props.navigation.navigate('reviews')}
					style={{ flexDirection: 'row', marginLeft: 5 }}
				>
					<Text>{this.props.service.rating.toFixed(1)}</Text>
					<View style={{ marginTop: 2, marginLeft: 5 }}>
						<StarsRating
							width={15}
							height={15}
							spacing={5}
							rating={this.props.service.rating}
						/>
					</View>

					<Text> ({this.props.service.ratingCount})</Text>
				</TouchableOpacity>
			);
		}
	};

	render() {
		const { service } = this.props;
		const {
			androidHeader,
			iosHeader,
			descriptionStyle,
			cardStyle,
			mapStyle,
			subtitleStyle,
			infoStyle,
			contentStyle,
			buttonStyle,
			buttonViewStyle
		} = styles;

		let categoryName = service.category.split('_');
		for (let i = 0; i < categoryName.length; i++) {
			categoryName[i] =				categoryName[i].charAt(0).toUpperCase()
				+ categoryName[i].substring(1);
		}
		categoryName = categoryName.join(' ');

		return (
			<Container style={{ flex: 1 }}>
				<Header
					style={
						Platform.OS === 'android' ? androidHeader : iosHeader
					}
				>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
							disabled={this.state.favLoading}
						>
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'black', flex: 1, width: 50 }}
							/>
						</Button>
					</Left>
					<Body style={styles.titleStyle}>
						<Title style={{ color: 'black' }}>
							{service.title}
						</Title>
					</Body>

					<Right>
						<Button transparent title="Settings">
							{this.renderIcon()}
						</Button>
					</Right>
				</Header>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'android' ? 'padding' : null}
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<Content style={contentStyle} padder>
						<Text style={subtitleStyle}>Rating </Text>
						<View style={{ marginTop: 5 }}>
							{this.renderRatingAvg()}
						</View>
						<Text style={[subtitleStyle, { marginTop: 5 }]}>
							Category
						</Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body style={{ flexDirection: 'row' }}>
									<Text style={descriptionStyle}>
										{categoryName}
									</Text>
									{this.renderSubcategoryName()}
								</Body>
							</CardItem>
						</Card>

						<Text style={subtitleStyle}>Service Description </Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text style={descriptionStyle}>
										{service.description}
									</Text>
								</Body>
							</CardItem>
						</Card>
						<Text style={subtitleStyle}>Contact Information </Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text selectable style={descriptionStyle}>
										{service.displayName}
									</Text>
									<Text selectable style={infoStyle}>
										{service.email}
									</Text>
									<Text selectable style={infoStyle}>
										{service.phone}
									</Text>
								</Body>
							</CardItem>
						</Card>
						<Text style={subtitleStyle}>
							{service.locationData.city},{' '}
							{service.locationData.region}
						</Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text style={descriptionStyle}>
										We cover the following area
									</Text>
									<Animated
										style={mapStyle}
										region={this.state.region}
									>
										<MapView.Circle
											center={coords}
											radius={meters}
											strokeColor="#FF7043"
										/>
									</Animated>
									<Button
										transparent
										style={{
											position: 'absolute',
											marginTop: 20,
											marginLeft: 5
										}}
									>
										<Icon
											type="MaterialIcons"
											name="my-location"
											style={{ color: 'black' }}
											onPress={() => {
												this.setState({
													region: fixedRegion
												});
											}}
										/>
									</Button>
								</Body>
							</CardItem>
						</Card>
						<View style={buttonViewStyle}>
							<Button
								bordered
								style={buttonStyle}
								onPress={() => this.callPressed()}
							>
								<Text
									style={{ color: '#FF7043', fontSize: 15 }}
								>
									Call Now
								</Text>
							</Button>
							<Button
								bordered
								style={[buttonStyle, { marginLeft: '5%' }]}
								onPress={() => this.openEmail()}
							>
								<Text
									style={{ color: '#FF7043', fontSize: 15 }}
								>
									Email Now
								</Text>
							</Button>
						</View>
						{this.renderCurrentUserReview()}
						{this.renderAllReviews()}
					</Content>
				</KeyboardAvoidingView>
			</Container>
		);
	}
}
const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
	titleStyle: {
		flex: 4
	},
	contentStyle: {
		flex: 1,
		margin: 10
	},
	cardStyle: {
		shadowColor: null,
		shadowOffset: null,
		shadowOpacity: null,
		elevation: null,
		marginBottom: 5
	},
	descriptionStyle: {
		fontSize: 15
	},
	subtitleStyle: {
		marginTop: 10,
		fontWeight: 'bold',
		color: '#4DB6AC',
		fontSize: 17
	},
	footerBarStyle: {
		position: 'absolute',
		bottom: 30
	},
	categoryStyle: {
		marginTop: 10,
		color: '#FF7043'
	},
	mapStyle: {
		width: SCREEN_WIDTH - ((SCREEN_WIDTH * 10) / 100) * 2,
		height: 200,
		marginTop: 10
	},
	infoStyle: {
		marginTop: 5,
		fontSize: 15
	},
	buttonViewStyle: {
		marginTop: 10,
		flexDirection: 'row',
		width: '80%',
		alignItems: 'center',
		marginBottom: 10
	},
	buttonStyle: {
		borderColor: '#FF7043'
	},
	textAreaStyle: {
		marginTop: 10,
		marginLeft: -10,
		width: '100%'
	},
	charCountStyle: {
		color: '#bfc6ea',
		textAlign: 'right',
		marginLeft: '88%',
		marginBottom: 2
	},
	showMoreStyle: {
		color: '#03A9F4',
		fontSize: 15
	},
	commentDateStyle: {
		fontSize: 13,
		color: 'gray',
		marginLeft: 10
	}
};

const mapStateToProps = (state) => ({
	service: state.selectedService.service,
	favorites: state.favoriteServices,
	currentUserEmail: state.auth.email,
	displayName: state.auth.displayName,
	reviews: state.ratings.reviews,
	currentUserReview: state.ratings.currentUserReview
});

export default connect(
	mapStateToProps,
	{
		addFavorite,
		submitReview,
		getReviews,
		resetReview,
		deleteReview,
		removeFavorite,
		cancelAxiosRating
	}
)(SpecificServiceScreen);
