import React, { Component } from 'react';
import {
	SafeAreaView,
	KeyboardAvoidingView,
	DeviceEventEmitter,
	ScrollView,
	Dimensions,
	View
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import {
	createService,
	uploadImages,
	getLocationFromAddress,
	getLocationInfo
} from '../../api';
import { colors } from '../../shared/styles';
import { ProgressBar } from '../../components/UI';

// Slides
import ServiceCategory from './ServiceCategory';
import ServiceInformation from './ServiceInformation';
import ServiceLocation from './ServiceLocation';
import ServiceReview from './ServiceReview';
import ServiceImagePick from './ServiceImagePick';
import ServiceDeliveryStore from './ServiceDeliveryStore';

const WIDTH = Dimensions.get('window').width;

const initialState = {
	selectedCategory: undefined,
	selectedSubcategory: undefined,
	title: '',
	phone: '',
	location: '',
	miles: null,
	description: '',
	providerDescription: '',
	loading: false,
	images: null,
	imagesInfo: null,
	deliveryStore: undefined,
	hasDelivery: false,
	hasPhysicalLocation: false,
	website: '',
	contactEmail: '',
	logistic: null,
	screenProgress: 1
};

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;

class PublishServiceScreen extends Component {
	static navigationOptions = {
		title: 'Publish',
		tabBarIcon: ({ tintColor }) => (
			<Entypo name="plus" size={32} style={{ color: tintColor }} />
		)
	};

	state = initialState;

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
		willBlurSubscription = this.props.navigation.addListener(
			'willBlur',
			async () => {
				await this.setState(initialState);
				this.scrollTo1();
			}
		);
	}

	componentDidMount() {
		pageHit('Publish a service');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscription.remove();
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
		backPressSubscriptions.add(() => this.props.navigation.navigate('publishInfo'));
	};

	showToast = (text, type) => {
		this.props.showToast({ message: text, type, duration: 1500 });
		if (type === 'success') {
			this.setState(initialState);
		}
	};

	cleanState = () => {
		this.setState(initialState);
	};

	doPostService = async () => {
		this.setState({ loading: true });
		// grab everything from state
		const {
			selectedCategory,
			selectedSubcategory,
			title,
			phone,
			location,
			description,
			miles,
			providerDescription,
			contactEmail,
			logistic
		} = this.state;

		// make sure there are images, and add them to backend
		if (this.state.images != null) {
			await uploadImages(this.state.images, (imagesInfo) => {
				this.setState({ imagesInfo });
			});
		}
		// get coords from location
		const geolocation = await getLocationFromAddress(location);
		delete geolocation.accuracy;
		delete geolocation.altitude;

		// get location data from coords (city, country, etc)
		const locationData = await getLocationInfo({
			latitude: geolocation.latitude,
			longitude: geolocation.longitude
		});

		// create object to send to backend
		const servicePost = {
			category: selectedCategory.dbReference,
			subcategory: selectedCategory.subcategories
				? selectedSubcategory.dbReference
				: null,
			title,
			phone,
			geolocation,
			locationData,
			description,
			miles,
			imagesInfo: this.state.imagesInfo,
			isDelivery: this.state.hasDelivery,
			physicalLocation: this.state.hasPhysicalLocation ? location : null,
			providerDescription,
			contactEmail,
			uid: this.props.user.uid,
			displayName: this.props.user.displayName,
			website: this.state.website ? this.state.website : null,
			logistic
		};
		// send object to backend
		await createService(servicePost, (text, type, service) => {
			this.showToast(text, type);
			this.props.navigation.navigate('service', {
				service,
				onBack: 'home'
			});
		});
		// on blur we reset everything so we should be good here.
	};

	scrollTo1 = () => {
		this.setState({ screenProgress: 1 });
		const scrollXPos = WIDTH * 0;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo2 = () => {
		this.setState({ screenProgress: 2 });
		const scrollXPos = WIDTH * 1;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo3 = () => {
		this.setState({ screenProgress: 3 });
		const scrollXPos = WIDTH * 2;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo4 = () => {
		this.setState({ screenProgress: 4 });
		const scrollXPos = WIDTH * 3;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo5 = () => {
		this.setState({ screenProgress: 5 });
		const scrollXPos = WIDTH * 4;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo6 = () => {
		this.setState({ screenProgress: 6 });
		const scrollXPos = WIDTH * 5;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	render() {
		return (
			<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
				<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
					<ProgressBar
						width={(this.state.screenProgress * WIDTH) / 6}
						color={colors.primaryColor}
						heigth={4}
					/>

					<ScrollView
						ref={(ref) => {
							this.scrollRef = ref;
						}}
						style={{ flex: 1 }}
						keyboardShouldPersistTaps="always"
						horizontal
						pagingEnabled
						scrollEnabled={false}
					>
						{/* Screens here */}
						{/* Pick category and subcategory */}
						<ServiceCategory
							width={WIDTH}
							onNext={() => this.scrollTo2()}
							onBack={() => this.props.navigation.navigate('publishInfo')
							}
							categories={categories}
							selectCategory={(selectedCategory) => this.setState({
									selectedCategory,
									selectedSubcategory: undefined
								})
							}
							selectSubcategory={(selectedSubcategory) => this.setState({ selectedSubcategory })
							}
							state={{
								selectedCategory: this.state.selectedCategory,
								selectedSubcategory: this.state
									.selectedSubcategory
							}}
						/>
						<ServiceInformation
							width={WIDTH}
							onNext={() => {
								this.scrollTo3();
							}}
							onBack={() => this.scrollTo1()}
							titleChange={(title) => this.setState({ title })}
							phoneChange={(phone) => this.setState({ phone })}
							descriptionChange={(description) => this.setState({ description })
							}
							providerDescriptionChange={(providerDescription) => this.setState({ providerDescription })
							}
							websiteChange={(website) => this.setState({ website })
							}
							contactEmailChange={(contactEmail) => this.setState({ contactEmail })
							}
							state={{
								title: this.state.title,
								phone: this.state.phone,
								description: this.state.description,
								providerDescription: this.state
									.providerDescription,
								website: this.state.website,
								contactEmail: this.state.contactEmail
							}}
						/>
						<ServiceDeliveryStore
							width={WIDTH}
							onNext={() => this.scrollTo4()}
							onBack={() => this.scrollTo2()}
							selectDeliveryStore={(deliveryStore) => {
								if (deliveryStore) {
									if (deliveryStore.option === 0) {
										this.setState({
											deliveryStore,
											hasDelivery: true,
											hasPhysicalLocation: false,
											logistic: 'delivery'
										});
									}
									if (deliveryStore.option === 1) {
										this.setState({
											deliveryStore,
											hasDelivery: false,
											hasPhysicalLocation: true,
											miles: 5,
											logistic: 'physical'
										});
									}
									if (deliveryStore.option === 2) {
										this.setState({
											deliveryStore,
											hasDelivery: true,
											hasPhysicalLocation: true,
											logistic: 'both'
										});
									}
								}
							}}
							state={{ deliveryStore: this.state.deliveryStore }}
						/>
						<ServiceLocation
							width={WIDTH}
							onNext={() => this.scrollTo5()}
							onBack={() => this.scrollTo3()}
							locationChange={(location) => this.setState({ location })
							}
							milesChange={(miles) => this.setState({ miles })}
							state={{
								location: this.state.location,
								miles: this.state.miles,
								deliveryStore: this.state.deliveryStore,
								hasDelivery: this.state.hasDelivery,
								hasPhysicalLocation: this.state
									.hasPhysicalLocation
							}}
						/>

						<ServiceImagePick
							width={WIDTH}
							onNext={() => this.scrollTo6()}
							onBack={() => this.scrollTo4()}
							addImage={(position, image, fileName, type) => this.setState((prevState) => {
									let imageArray = prevState.images;
									if (imageArray === null) {
										imageArray = [];
									}
									imageArray.push({
										position,
										image,
										fileName,
										type
									});
									return { images: imageArray };
								})
							}
							removeImage={(position) => this.setState((prevState) => {
									const imageArray = prevState.images;
									// filter, copy all but the same position (the one deleted)
									const result = imageArray.filter(
										(obj) => obj.position !== position
									);
									return { images: result };
								})
							}
							changeOrder={(orderArray) => {
								const reorderedImages = [];
								this.setState((prevState) => {
									const currentImagesArray = prevState.images;
									// find and copy one by one, according to the order array received
									orderArray.forEach((index) => {
										const result = currentImagesArray.find(
											(obj) => obj.position
												=== parseInt(index, 10)
										);
										reorderedImages.push(result);
									});
									return { images: reorderedImages };
								});
							}}
							state={{ images: this.state.images }}
						/>

						<ServiceReview
							width={WIDTH}
							onBack={() => this.scrollTo5()}
							onComplete={this.doPostService}
							loading={this.state.loading}
							state={this.state}
						/>
					</ScrollView>
				</SafeAreaView>
			</KeyboardAvoidingView>
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
	{ showToast }
)(PublishServiceScreen);
