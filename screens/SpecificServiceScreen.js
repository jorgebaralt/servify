import React, { Component } from 'react';
import { View, Dimensions, Platform } from 'react-native';
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
	Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { MapView, Linking } from 'expo';
import { updateFavorite } from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
let currentFavorite = [];

class SpecificServiceScreen extends Component {
	state = { isFav: false };

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
	};

	onBackPress = () => {
		this.props.navigation.goBack(null);
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

	favPressed = () => {
		const { email } = this.props;
		if (this.state.isFav) {
			this.removeFavorite(email);
		} else {
			this.addFavorite(email);
		}
	};

	callPressed = async () => {
		const { phone } = this.props.service;
		await Linking.openURL('tel:+1' + phone.replace(/\D/g, ''));
	};

	openEmail = async () => {
		Linking.openURL(`mailto:${this.props.service.email}`);
	};

	renderIcon = () => {
		if (this.props.email === this.props.service.email) {
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
			/>
		);
	};

	renderSubcategoryName = () => {
		const { service } = this.props;
		const { descriptionStyle, cardStyle, subtitleStyle } = styles;
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
		const { latitude, longitude } = service.geolocation;
		const coords = { latitude, longitude };
		const meters = service.miles * 1609.34;
		let latitudeDelta = 0.0922;

		if (service.miles <= 3) {
			latitudeDelta = 0.0799;
		} else if (service.miles <= 10 && service.miles > 3) {
			latitudeDelta = 0.45;
		} else if (service.miles <= 30 && service.miles > 20) {
			latitudeDelta = 0.8;
		} else if (service.miles <= 60 && service.miles > 30) {
			latitudeDelta = 1.5;
		}

		let categoryName = service.category.split('_');
		for (let i = 0; i < categoryName.length; i++) {
			categoryName[i] = categoryName[i].charAt(0).toUpperCase() + categoryName[i].substring(1);
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
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body style={styles.titleStyle}>
						<Title style={{ color: 'black', marginLeft: 10 }}>{service.title}</Title>
					</Body>

					<Right>
						<Button transparent title="Settings">
							{this.renderIcon()}
						</Button>
					</Right>
				</Header>

				<Content style={contentStyle} padder>
					{/* TODO: Add Ratings */}
					{/* <Text style={subtitleStyle}>Rating </Text> */}

					{/* <View style={rowDirectionStyle}>
                        <Text style={subtitleStyle}>Category</Text>
                        <Text style={regularTextStyle}>{service.title}</Text>
					</View> */}
					<Text style={[subtitleStyle, { marginTop: 0 }]}>Category</Text>
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
								<Text selectable style={infoStyle}>
									{service.displayName}:
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
								<MapView
									style={mapStyle}
									initialRegion={{
										latitude,
										longitude,
										latitudeDelta,
										longitudeDelta: 0.0421
									}}
								>
									<MapView.Circle
										center={coords}
										radius={meters}
										strokeColor="#FF7043"
									/>
								</MapView>
							</Body>
						</CardItem>
					</Card>
					<View style={buttonViewStyle}>
						<Button
							bordered
							style={buttonStyle}
							onPress={() => this.callPressed()}
						>
							<Text style={{ color: '#FF7043', fontSize: 14 }}>Call Now</Text>
						</Button>
						<Button
							bordered
							style={[buttonStyle, { marginLeft: '5%' }]}
							onPress={() => this.openEmail()}
						>
							<Text style={{ color: '#FF7043', fontSize: 14 }}>Email Now</Text>
						</Button>
					</View>
					<Text style={subtitleStyle}>Reviews</Text>

					{/* TODO: Add a share fab button */}
				</Content>
			</Container>
		);
	}
}
const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5',
	},
	iosHeader: {},
	titleStyle: {
		flex: 4
	},
	contentStyle: {
		flex: 1,
		marginTop: 10
	},
	cardStyle: {
		// shadowColor: null,
		// shadowOffset: null,
		// shadowOpacity: null,
		// elevation: null
	},
	descriptionStyle: {
		fontSize: 14
	},
	subtitleStyle: {
		marginTop: 10,
		fontWeight: 'bold',
		color: '#4DB6AC',
		fontSize: 16
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
		width: SCREEN_WIDTH - ((SCREEN_WIDTH * 7) / 100) * 2,
		height: 200,
		marginTop: 10
	},
	infoStyle: {
		marginTop: 5,
		fontSize: 14
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
	}
};

const mapStateToProps = (state) => ({
	service: state.selectedService.service,
	favorites: state.favoriteServices,
	email: state.auth.email
});

export default connect(
	mapStateToProps,
	{ updateFavorite }
)(SpecificServiceScreen);
