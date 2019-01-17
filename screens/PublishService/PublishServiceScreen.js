import React, { Component } from 'react';
import {
	SafeAreaView,
	KeyboardAvoidingView,
	DeviceEventEmitter,
	ScrollView,
	Dimensions
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import { createService, uploadImages } from '../../api';

// Screens
import ServiceCategory from './ServiceCategory';
import ServiceInformation from './ServiceInformation';
import ServiceLocation from './ServiceLocation';
import ServiceReview from './ServiceReview';
import ServiceImagePick from './ServiceImagePick';

const WIDTH = Dimensions.get('window').width;

const initialState = {
	selectedCategory: undefined,
	selectedSubcategory: undefined,
	title: '',
	phone: '',
	location: '',
	miles: 1,
	description: '',
	loading: false,
	images: null,
	imagesInfo: null
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
		const {
			selectedCategory,
			selectedSubcategory,
			title,
			phone,
			location,
			description,
			miles
		} = this.state;
		if (
			selectedCategory
			&& phone
			&& location
			&& description
			&& title
			&& miles
		) {
			this.setState({ loading: true });
			// make sure there are images
			if (this.state.images != null) {
				await uploadImages(this.state.images, (imagesInfo) => { this.setState({ imagesInfo }); });
			}
			const { displayName } = this.props.user;
			const servicePost = {
				selectedCategory,
				selectedSubcategory,
				title,
				phone,
				location,
				description,
				miles,
				displayName,
				imagesInfo: this.state.imagesInfo
			};
			await createService(
				servicePost,
				this.props.user.email,
				(text, type) => this.showToast(text, type)
			);
			// on blur we reset everything so we should be good here.
			this.props.navigation.navigate('home');
		} else {
			this.showToast('Please fill all the fields', 'warning');
			this.setState({ loading: false });
		}
	};

	scrollTo1 = () => {
		const scrollXPos = WIDTH * 0;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo2 = () => {
		const scrollXPos = WIDTH * 1;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo3 = () => {
		const scrollXPos = WIDTH * 2;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo4 = () => {
		const scrollXPos = WIDTH * 3;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	scrollTo5 = () => {
		const scrollXPos = WIDTH * 4;
		this.scrollRef.scrollTo({ x: scrollXPos, y: 0 });
	};

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
							onNext={this.scrollTo2}
							onBack={() => this.props.navigation.navigate('publishInfo')
							}
							categories={categories}
							selectCategory={(selectedCategory) => this.setState({ selectedCategory })
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
							onNext={this.scrollTo3}
							onBack={() => this.scrollTo1}
							titleChange={(title) => this.setState({ title })}
							phoneChange={(phone) => this.setState({ phone })}
							descriptionChange={(description) => this.setState({ description })
							}
							state={{
								title: this.state.title,
								phone: this.state.phone,
								description: this.state.description
							}}
						/>
						<ServiceLocation
							width={WIDTH}
							onNext={this.scrollTo4}
							onBack={() => this.scrollTo2}
							locationChange={(location) => this.setState({ location })
							}
							milesChange={(miles) => this.setState({ miles })}
							state={{
								location: this.state.location,
								miles: this.state.miles
							}}
						/>

						<ServiceImagePick
							width={WIDTH}
							onNext={this.scrollTo5}
							onBack={() => this.scrollTo3}
							addImage={(position, image, fileName, type) => this.setState((prevState) => {
									let imageArray = prevState.images;
									if (imageArray === null) {
										imageArray = [];
									}
									imageArray.push({ position, image, fileName, type });
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
							onBack={() => this.scrollTo4}
							onComplete={this.doPostService}
							loading={this.state.loading}
							state={this.state}
						/>
					</ScrollView>
				</KeyboardAvoidingView>
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
	{ showToast }
)(PublishServiceScreen);