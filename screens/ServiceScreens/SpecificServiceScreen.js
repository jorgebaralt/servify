import React, { Component } from 'react';
import {
	View,
	KeyboardAvoidingView,
	DeviceEventEmitter,
	FlatList,
	Alert,
	ScrollView,
	Text,
	ActivityIndicator,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { Ionicons, Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { MapView, Linking } from 'expo';
import {
	addFavorite,
	removeFavorite,
	submitReview,
	getReviews,
	deleteReview,
	cancelAxiosRating
} from '../../api';
import { pageHit } from '../../shared/ga_helper';
import StarsRating from '../../components/Ratings/StarsRating';
import StarsRatingPick from '../../components/Ratings/StarsRatingPick';
import DollarRatingPick from '../../components/Ratings/DollarRatingPick';
import { colors } from '../../shared/styles';
import {
	ReviewCard,
	Button,
	TextArea,
	AnimatedHeader,
	FadeImage,
	Tooltip
} from '../../components/UI';
import { formatDate } from '../../shared/helpers';
import {
	Category,
	Subcategory,
	Location,
	Description,
	Delivery,
	Home,
	Website,
	TooltipIcon
} from '../../assets/svg';
import DollarRating from '../../components/Ratings/DollarRating';
import { defaultImage } from '../../assets/default/categories';

const maxCharCount = 100;

const WIDTH = Dimensions.get('window').width;

let willFocusSubscription;
let backPressSubscriptions;

class SpecificServiceScreen extends Component {
	// disable gestures back
	static navigationOptions = {
		gesturesEnabled: false
	};

	state = {
		isFav: false,
		favLoading: false,
		comment: '',
		commentCharCount: maxCharCount,
		starCount: 0,
		dollarCount: 0,
		loadingUserComment: false,
		currentUserReview: null,
		reviews: null,
		service: this.props.navigation.getParam('service'),
		transparentHeader: true,
		descriptionLength: 100,
		providerDescriptionLength: 100,
		showTooltip: false
	};

	componentWillMount = async () => {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.handleAndroidBack();
			}
		);

		const { service } = this.state;

		// Starting search of current user review
		this.setState({
			loadingUserComment: true
		});
		// if current user, is in the service favUser, then we he cant add another review
		if (service.favUsers.includes(this.props.user.uid)) {
			this.setState({ isFav: true });
		}
		// get all reviews, except for current user
		await getReviews(
			service.id,
			this.props.user.uid,
			(currentUserReview, reviews) => this.setState({ currentUserReview, reviews })
		);

		// change loading comment state
		this.setState({ loadingUserComment: false });
	};

	componentDidMount() {
		pageHit('Specific Service Screen');
	}

	async componentWillUnmount() {
		await cancelAxiosRating();
		willFocusSubscription.remove();
	}

	handleScroll = (event) => {
		if (event.nativeEvent.contentOffset.y > 200) {
			this.setState({ transparentHeader: false });
		} else {
			this.setState({ transparentHeader: true });
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
		backPressSubscriptions.add(() => {
			this.onBackPress();
		});
	};

	onBackPress = async () => {
		await cancelAxiosRating();
		const customBack = this.props.navigation.getParam('onBack');
		if (customBack) {
			this.props.navigation.navigate(customBack);
		} else {
			this.props.navigation.pop();
		}
	};

	addFavorite = async (uid) => {
		this.setState({ isFav: true });
		await addFavorite(uid, this.state.service.id);
	};

	removeFavorite = async (uid) => {
		this.setState({ isFav: false });
		await removeFavorite(uid, this.state.service.id);
	};

	favPressed = async () => {
		this.setState({ favLoading: true });
		const { user } = this.props;
		if (this.state.isFav) {
			await this.removeFavorite(user.uid);
		} else {
			await this.addFavorite(user.uid);
		}
		this.setState({ favLoading: false });
	};

	callPressed = async () => {
		const { phone } = this.state.service;
		await Linking.openURL('tel:+1' + phone.replace(/\D/g, ''));
	};

	openEmail = async () => {
		Linking.openURL(`mailto:${this.state.service.contactEmail}`);
	};

	reportAlert = () => {
		Alert.alert('Report', 'Do you want to report this service?', [
			{
				text: 'Report',
				onPress: () => this.props.navigation.navigate('report', {
						service: this.state.service
					})
			},
			{
				text: 'Cancel'
			}
		]);
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
				price: this.state.dollarCount,
				comment: this.state.comment,
				reviewerDisplayName: this.props.user.displayName,
				reviewerEmail: this.props.user.email,
				uid: this.props.user.uid,
				serviceId: this.state.service.id
			};
			await submitReview(
				this.state.service.id,
				review,
				(currentUserReview) => this.setState({
						loadingUserComment: false,
						currentUserReview
					})
			);
		}
	};

	renderCommentDate = (currentUserReview) => {
		const reviewDate = formatDate(currentUserReview.timestamp);

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
		await deleteReview(this.state.currentUserReview, () => this.setState({ currentUserReview: null }));
		this.setState({
			loadingUserComment: false,
			starCount: 0,
			dollarCount: 0,
			currentUserReview: null,
			comment: ''
		});
	};

	editReviewAlert = () => {
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
		const { commentBorder } = styles;
		const { currentUserReview } = this.state;
		if (this.state.loadingUserComment) {
			return (
				<ActivityIndicator
					size="large"
					color={colors.primaryColor}
					style={{ marginTop: 10, marginBottom: 40 }}
				/>
			);
		}
		if (this.props.user.uid !== this.state.service.uid) {
			// User have not added a review yet
			if (!currentUserReview) {
				return (
					<View style={{ zIndex: 0 }}>
						<Text style={styles.titleStyle}>Leave a review</Text>
						<View
							style={[
								commentBorder,
								{
									marginTop: 10,
									marginBottom: 20
								}
							]}
						>
							<Text style={{ fontSize: 20, color: colors.black }}>
								{this.props.user.displayName}
							</Text>
							<StarsRatingPick
								style={{ marginTop: 5 }}
								size={20}
								spacing={5}
								rating={this.state.starCount}
								selectRating={(count) => this.setState({
										starCount: count
									})
								}
							/>

							<View>
								{/* Tooltip */}
								{this.state.showTooltip ? (
									<Tooltip style={{ bottom: 40 }}>
										<Text style={{ color: colors.white }}>
											${'   '}: price is low compared to
											similar services
											{'\n'}
											$${'  '}: price is similar compared
											to similar services{'\n'}
											$$$ : price is higher than similar
											services
											{'\n'}
											$$$$: price is more expensive than
											similar services{'\n'}
											<Text
												style={{
													fontSize: 14,
													alignSelf: 'flex-end',
													textAlign: 'right'
												}}
												onPress={() => this.setState({
														showTooltip: false
													})
												}
											>
												Close
											</Text>
										</Text>
									</Tooltip>
								) : null}
								<View
									style={[
										styles.rowStyle,
										{ justifyContent: 'space-between' }
									]}
								>
									<DollarRatingPick
										style={{ marginTop: 5 }}
										size={16}
										rating={this.state.dollarCount}
										selectRating={(count) => this.setState({
												dollarCount: count
											})
										}
									/>
									<TouchableOpacity
										onPress={() => this.setState((prevState) => ({
												showTooltip: !prevState.showTooltip
											}))
										}
									>
										<TooltipIcon
											size={30}
											style={{ marginTop: 3 }}
											onPress={() => this.setState({
													showTooltip: true
												})
											}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<TextArea
								label="Comment"
								size={30}
								firstColor={colors.darkGray}
								secondColor={colors.secondaryColor}
								fontColor={colors.black}
								multiline
								bordered
								numberOfLines={3}
								placeholder="Write your review here"
								value={this.state.comment}
								onChangeText={(comment) => this.commentChangeText(comment)
								}
								style={{ marginTop: 10 }}
							/>
							<Text
								style={{
									color: colors.darkGray,
									fontSize: 14,
									alignSelf: 'flex-end'
								}}
							>
								{this.state.commentCharCount}
							</Text>
							<Button
								bordered
								onPress={() => this.submitReview()}
								disabled={
									this.state.starCount === 0
									|| this.state.comment === ''
									|| this.state.dollarCount === 0
								}
								style={{
									marginTop: 5,
									alignSelf: 'flex-end'
								}}
								color={colors.primaryColor}
								textColor={colors.primaryColor}
							>
								<Text style={{ fontSize: 15 }}>
									Submit review
								</Text>
							</Button>
						</View>
						<View style={styles.divideLine} />
					</View>
				);
			}
			// User sees his own review
			return (
				<View>
					<Text style={styles.titleStyle}>Your review</Text>
					<View style={[commentBorder, { marginTop: 10 }]}>
						<View
							style={[
								styles.rowStyle,
								{
									justifyContent: 'space-between',
									marginTop: 0
								}
							]}
						>
							<Text
								style={{
									fontSize: 16,
									color: colors.black
								}}
							>
								{this.props.user.displayName}
							</Text>
							<Entypo
								name="dots-three-horizontal"
								size={24}
								onPress={() => this.editReviewAlert()}
							/>
						</View>
						<View style={styles.rowStyle}>
							<StarsRating
								size={16}
								spacing={5}
								rating={currentUserReview.rating}
							/>
							<Text
								style={{
									marginLeft: 10,
									color: colors.darkGray,
									fontSize: 14
								}}
							>
								{this.renderCommentDate(currentUserReview)}
							</Text>
						</View>
						{currentUserReview.price ? (
							<DollarRating
								rating={currentUserReview.price}
								size={16}
								style={{ marginTop: 4 }}
							/>
						) : null}
						<Text style={{ color: colors.darkGray, marginTop: 4 }}>
							{currentUserReview.comment}
						</Text>
					</View>
					<View style={styles.divideLine} />
				</View>
			);
		}
	};

	renderReviews = (review) => <ReviewCard review={review} />;

	renderAllReviews = () => {
		if (this.state.reviews) {
			if (this.state.reviews.length !== 0) {
				return (
					<View>
						<Text style={styles.titleStyle}>Reviews</Text>
						<FlatList
							data={this.state.reviews}
							renderItem={({ item, index }) => this.renderReviews(item, index)
							}
							enableEmptySections
							style={{ padding: 4 }}
							keyExtractor={(item) => item.timestamp}
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
					onPress={() => this.props.navigation.navigate('reviews', {
							service: this.state.service
						})
					}
				>
					Show more
				</Text>
			</View>
		);
	};

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{
				color: this.state.transparentHeader
					? colors.white
					: colors.black
			}}
			onPress={() => {
				this.onBackPress();
			}}
		/>
	);

	headerRightIcon = () => {
		if (this.props.user.uid === this.state.service.uid) {
			return (
				<Entypo
					size={32}
					name="dots-three-horizontal"
					style={{
						color: this.state.transparentHeader
							? colors.white
							: colors.black
					}}
					onPress={() => this.props.navigation.navigate('editService', {
							service: this.state.service
						})
					}
				/>
			);
		}
		return (
			<View style={{ flexDirection: 'row', marginTop: 5 }}>
				<MaterialIcons
					name="info-outline"
					style={{
						color: this.state.transparentHeader
							? colors.white
							: colors.black,
						marginRight: 10
					}}
					size={26}
					onPress={() => this.reportAlert()}
					disabled={this.state.favLoading}
				/>
				<MaterialIcons
					name={this.state.isFav ? 'favorite' : 'favorite-border'}
					style={{ color: colors.danger }}
					onPress={() => this.favPressed()}
					disabled={this.state.favLoading}
					size={26}
				/>
			</View>
		);
	};

	renderMap = () => {
		const { service } = this.state;
		const { latitude, longitude } = service.geolocation;
		const center = { latitude, longitude };
		let serviceMiles = 1;
		if (service.miles != null) {
			serviceMiles = service.miles;
		}
		const radius = serviceMiles * 1609.34;
		const fixedRegion = {
			latitude,
			longitude,
			latitudeDelta: 0.03215 * serviceMiles,
			longitudeDelta: 0.0683 * serviceMiles
		};
		return (
			<View pointerEvents="none">
				<MapView
					style={{
						height: 200,
						width: '100%',
						marginTop: 20,
						borderRadius: 8,
						marginBottom: 40
					}}
					region={fixedRegion}
				>
					{service.miles ? (
						<MapView.Circle
							center={center}
							radius={radius}
							strokeColor={colors.primaryColor}
						/>
					) : null}
					{service.physicalLocation ? (
						<MapView.Marker coordinate={center} />
					) : null}
				</MapView>
				<View style={styles.divideLine} />
			</View>
		);
	};

	renderHeaderImages = (imagesInfo, i) => (
		<FadeImage
			uri={imagesInfo.url}
			style={{ height: 300, width: WIDTH }}
			showDots={imagesInfo.url}
			currentDot={i}
			dotCount={
				this.state.service.imagesInfo
					? this.state.service.imagesInfo.length
					: 0
			}
		/>
	);

	render() {
		const { service } = this.state;
		const {
			descriptionStyle,
			contentStyle,
			rowStyle,
			divideLine,
			titleStyle
		} = styles;

		// Category and subcategory name format
		let categoryName = service.category.split('_');
		for (let i = 0; i < categoryName.length; i++) {
			categoryName[i] =				categoryName[i].charAt(0).toUpperCase()
				+ categoryName[i].substring(1);
		}
		categoryName = categoryName.join(' ');
		let subcategoryName = '';
		if (service.subcategory) {
			subcategoryName = service.subcategory.split('_');
			for (let i = 0; i < subcategoryName.length; i++) {
				subcategoryName[i] =					subcategoryName[i].charAt(0).toUpperCase()
					+ subcategoryName[i].substring(1);
			}
			subcategoryName = subcategoryName.join(' ');
		}
		// Images for the header
		const imageData = service.imagesInfo
			? service.imagesInfo.length > 0
				? service.imagesInfo
				: [{ fileName: '1', url: defaultImage(service.category) }]
			: [{ fileName: '1', url: defaultImage(service.category) }];
		return (
			<KeyboardAvoidingView
				behavior="position"
				style={{
					zIndex: -1,
					backgroundColor: colors.white
				}}
			>
				<AnimatedHeader
					left={this.headerLeftIcon()}
					right={this.headerRightIcon()}
					transparent={this.state.transparentHeader}
				/>
				<ScrollView
					style={contentStyle}
					padder
					keyboardShouldPersistTaps="handled"
					onScroll={(event) => this.handleScroll(event)}
					scrollEventThrottle={10}
				>
					{/* Header Images */}
					<FlatList
						horizontal
						data={imageData}
						renderItem={({ item, index }) => this.renderHeaderImages(item, index)
						}
						keyExtractor={(item) => item.fileName}
						pagingEnabled
					/>
					<View
						style={{
							paddingLeft: 20,
							paddingRight: 20,
							backgroundColor: colors.white
						}}
					>
						{/* Service info */}
						<Text style={titleStyle}>{service.title}</Text>
						<View style={rowStyle}>
							<Category
								height={18}
								width={18}
								style={{ marginTop: 2 }}
							/>
							<Text style={descriptionStyle}>{categoryName}</Text>
						</View>
						{/* if there is subcategory */}
						{service.subcategory ? (
							<View style={{ flexDirection: 'row' }}>
								<Subcategory
									height={18}
									width={18}
									style={{ marginTop: 5 }}
								/>
								<Text style={descriptionStyle}>
									{subcategoryName}
								</Text>
							</View>
						) : null}
						<View style={rowStyle}>
							<Description
								height={18}
								width={18}
								style={{ marginTop: 0 }}
							/>
							<Text style={descriptionStyle}>
								{service.description.substring(
									0,
									this.state.descriptionLength
								)}
							</Text>
						</View>
						{/* extend description */}
						{service.description.length > 100
						&& this.state.descriptionLength
							< service.description.length ? (
							<Text
								style={{
									color: colors.secondaryColor,
									alignSelf: 'flex-end'
								}}
								onPress={() => this.setState({
										descriptionLength:
											service.description.length
									})
								}
							>
								more
							</Text>
						) : null}
						{/* If website */}
						{/* TODO: on press redirect to website, using webview */}
						{service.website ? (
							<View style={rowStyle}>
								<Website
									height={18}
									width={18}
									style={{ marginTop: 0 }}
								/>
								<Text style={descriptionStyle} selectable>
									{service.website}
								</Text>
							</View>
						) : null}

						<View style={divideLine} />
						{/* Contact information  */}
						<Text style={titleStyle}>Contact Information </Text>
						{/* Display contact email */}
						{service.contactEmail ? (
							<View style={rowStyle}>
								<MaterialIcons
									name="email"
									size={18}
									style={{ color: colors.secondaryColor }}
								/>
								<Text style={descriptionStyle}>
									{service.contactEmail}
								</Text>
							</View>
						) : null}

						<View style={rowStyle}>
							<MaterialIcons
								name="phone"
								size={18}
								style={{ color: colors.secondaryColor }}
							/>
							<Text style={descriptionStyle}>
								{service.phone}
							</Text>
						</View>
						{/* Provider description */}
						{service.providerDescription ? (
							<View>
								<View style={rowStyle}>
									<Description
										height={18}
										width={18}
										style={{ marginTop: 0 }}
									/>
									<Text style={descriptionStyle}>
										{service.providerDescription.substring(
											0,
											this.state.providerDescriptionLength
										)}
									</Text>
								</View>
								{service.providerDescription.length > 100
								&& this.state.providerDescriptionLength
									< service.providerDescription.length ? (
									<Text
										style={{
											color: colors.secondaryColor,
											alignSelf: 'flex-end'
										}}
										onPress={() => this.setState({
												providerDescriptionLength:
													service.providerDescription
														.length
											})
										}
									>
										more
									</Text>
								) : null}
							</View>
						) : null}
						<View style={rowStyle}>
							<Button
								bordered
								onPress={() => this.callPressed()}
								color={colors.primaryColor}
								textColor={colors.primaryColor}
							>
								<Text>Call Now</Text>
							</Button>
							{service.contactEmail ? (
								<Button
									bordered
									onPress={() => this.openEmail()}
									color={colors.primaryColor}
									textColor={colors.primaryColor}
									style={{ marginLeft: 10 }}
								>
									<Text>Send an Email</Text>
								</Button>
							) : null}
						</View>
						
						<View style={divideLine} />
						{/* Location */}
						<Text style={titleStyle}>Location</Text>
						<View style={rowStyle}>
							<Location
								height={18}
								width={18}
								style={{ color: colors.secondaryColor }}
							/>
							<Text style={descriptionStyle}>
								This service is located at{' '}
								{service.locationData.city},{' '}
								{service.locationData.region}
							</Text>
						</View>
						{/* If service is delivery, say it */}
						{service.isDelivery ? (
							<View style={rowStyle}>
								<Delivery
									height={18}
									width={18}
									style={{ color: colors.secondaryColor }}
								/>
								<Text style={descriptionStyle}>We deliver</Text>
							</View>
						) : null}
						{/* If there is physical location */}
						{service.physicalLocation ? (
							<View style={rowStyle}>
								<Home
									height={18}
									width={18}
									style={{ color: colors.secondaryColor }}
								/>
								<Text style={descriptionStyle}>
									We are located at {service.physicalLocation}
								</Text>
							</View>
						) : null}
						{this.renderMap()}
						{this.renderCurrentUserReview()}
						{this.renderAllReviews()}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}
const styles = {
	contentStyle: {
		backgroundColor: colors.white,
		zIndex: -1
	},
	rowStyle: { flexDirection: 'row', marginTop: 10 },
	descriptionStyle: {
		fontSize: 16,
		fontWeight: '500',
		marginLeft: 10,
		marginRight: 10,
		color: colors.darkerGray
	},
	divideLine: {
		height: 1,
		backgroundColor: colors.lightGray,
		width: '100%',
		marginTop: 10
	},
	titleStyle: {
		fontSize: 22,
		fontWeight: '600',
		marginTop: 20,
		color: colors.secondaryColor
	},
	commentBorder: {
		borderWidth: 1,
		borderColor: colors.lightGray,
		borderRadius: 8,
		padding: 10,
		marginBottom: 20,
		backgroundColor: colors.white
	},
	showMoreStyle: {
		color: '#03A9F4',
		fontSize: 15
	}
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(SpecificServiceScreen);
