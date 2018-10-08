import React, { Component } from 'react';
import { View, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { AirbnbRating, Rating } from 'react-native-ratings';
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
	Textarea
} from 'native-base';
import { connect } from 'react-redux';
import { MapView, Linking } from 'expo';
import { AnimatedRegion, Animated } from 'react-native-maps';
import { updateFavorite } from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const maxCharCount = 100;
let currentFavorite = [];
let coords;
let meters;
let latitudeDelta;
let fixedRegion;

class SpecificServiceScreen extends Component {
	state = {
		isFav: false,
		favLoading: false,
		region: undefined,
		description: '',
		descriptionCharCount: maxCharCount
	};

	componentWillMount = async () => {
		const { service } = this.props;
		const { favorites } = this.props;
		if (favorites.length) {
			currentFavorite = favorites;
			currentFavorite.forEach((element) => {
				if (
					element.title === service.title
					&& element.category === service.category
					&& element.description === service.description
				) {
					this.setState({ isFav: true });
				}
			});
		}
		const { latitude, longitude } = service.geolocation;
		coords = { latitude, longitude };
		meters = service.miles * 1609.34;
		latitudeDelta = 0.0922;

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
			region: new AnimatedRegion(fixedRegion)
		});
	};

	onBackPress = () => {
		this.props.navigation.goBack();
	};

	addFavorite = async (email) => {
		this.setState({ isFav: true });
		currentFavorite.push(this.props.service);
		await this.props.updateFavorite(email, currentFavorite);
	};

	removeFavorite = async (email) => {
		const { service } = this.props;
		this.setState({ isFav: false });
		currentFavorite.forEach((element, i) => {
			if (
				element.title === service.title
				&& element.category === service.category
				&& element.description === service.description
			) {
				currentFavorite.splice(i, 1);
			}
		});
		await this.props.updateFavorite(email, currentFavorite);
	};

	favPressed = async () => {
		this.setState({ favLoading: true });
		const { email } = this.props;
		if (this.state.isFav) {
			await this.removeFavorite(email);
		} else {
			await this.addFavorite(email);
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

	renderIcon = () => {
		if (this.props.currentUserEmail === this.props.service.email) {
			return (
				<Icon
					type="Entypo"
					name="dots-three-horizontal"
					style={{ color: 'black' }}
					onPress={() => this.props.navigation.navigate('editService')}
				/>
			);
		}
		return (
			<Icon
				type="MaterialIcons"
				name={this.state.isFav ? 'favorite' : 'favorite-border'}
				style={{ color: '#D84315' }}
				onPress={() => this.favPressed()}
				disabled={this.state.favLoading}
			/>
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

	ratingCompleted = (count) => {
		console.log(count);
	};

	descriptionChangeText = (text) => {
		const { descriptionCharCount } = this.state;
		if (descriptionCharCount < maxCharCount) {
			this.setState({ description: text });
		}
		this.setState({ descriptionCharCount: maxCharCount - text.length });
	};

	renderCurrentUserReview = () => {
		const {
			cardStyle,
			descriptionStyle,
			infoStyle,
			textAreaStyle,
			charCountStyle
		} = styles;
		if (this.props.currentUserEmail !== this.props.service.email) {
			// TODO: check if user already added comment
			return (
				<Card style={cardStyle}>
					<CardItem>
						<Body>
							<Text style={{ fontSize: 17 }}>{this.props.displayName}</Text>
							<View style={{ marginTop: 10, marginLeft: -5 }}>
								<AirbnbRating
									showRating
									style={{ margin: 25 }}
									count={5}
									defaultRating={0}
									size={30}
									onFinishRating={(count) => this.ratingCompleted(count)}
								/>
							</View>
							<Textarea
								style={textAreaStyle}
								rowSpan={2}
								placeholder="Add your comments here"
								maxLength={maxCharCount}
								value={this.state.description}
								onChangeText={(text) => this.descriptionChangeText(text)}
							/>
							<Text style={charCountStyle}>
								{this.state.descriptionCharCount}
							</Text>
						</Body>
					</CardItem>
				</Card>
			);
		}
	};

	renderAllReviews = () => {
		const { descriptionStyle } = styles;
		return (
			<View style={{ marginTop: 20 }}>
				<Text style={descriptionStyle}>Render 5 comments here </Text>
			</View>
		);
	};

	showMoreComments = () => {
		const { showMoreStyle } = styles;
		return (
			<View style={{ marginTop: 10, marginBottom: 40 }}>
				<Text style={showMoreStyle}>Show more</Text>
			</View>
		);
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
			categoryName[i] =				categoryName[i].charAt(0).toUpperCase() + categoryName[i].substring(1);
		}
		categoryName = categoryName.join(' ');

		return (
			<Container style={{ flex: 1 }}>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
							disabled={this.state.favLoading}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body style={styles.titleStyle}>
						<Title style={{ color: 'black', marginLeft: 10 }}>
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
						{/* TODO: Add Rating average here */}
						{/* <Text style={subtitleStyle}>Rating </Text> */}

						{/* <View style={rowDirectionStyle}>
                        <Text style={subtitleStyle}>Category</Text>
                        <Text style={regularTextStyle}>{service.title}</Text>
					</View> */}
						<Text style={[subtitleStyle, { marginTop: 5 }]}>Category</Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body style={{ flexDirection: 'row' }}>
									<Text style={descriptionStyle}>{categoryName}</Text>
									{this.renderSubcategoryName()}
								</Body>
							</CardItem>
						</Card>

						<Text style={subtitleStyle}>Service Description </Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text style={descriptionStyle}>{service.description}</Text>
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
							{service.locationData.city}, {service.locationData.region}
						</Text>
						<Card style={cardStyle}>
							<CardItem>
								<Body>
									<Text style={descriptionStyle}>
										We cover the following area
									</Text>
									<Animated style={mapStyle} region={this.state.region}>
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
												this.setState({ region: fixedRegion });
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
								<Text style={{ color: '#FF7043', fontSize: 15 }}>Call Now</Text>
							</Button>
							<Button
								bordered
								style={[buttonStyle, { marginLeft: '5%' }]}
								onPress={() => this.openEmail()}
							>
								<Text style={{ color: '#FF7043', fontSize: 15 }}>
									Email Now
								</Text>
							</Button>
						</View>
						<Text style={subtitleStyle}>Reviews</Text>
						{this.renderCurrentUserReview()}
						{this.renderAllReviews()}
						{this.showMoreComments()}
						{/* TODO: Add a share fab button */}
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
		marginBottom: null
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
		marginLeft: '90%'
	},
	showMoreStyle: {
		color: '#03A9F4',
		fontSize: 15
	}
};

const mapStateToProps = (state) => ({
	service: state.selectedService.service,
	favorites: state.favoriteServices,
	currentUserEmail: state.auth.email,
	displayName: state.auth.displayName
});

export default connect(
	mapStateToProps,
	{ updateFavorite }
)(SpecificServiceScreen);
