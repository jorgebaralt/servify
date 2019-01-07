import React, { Component } from 'react';
import {
	SafeAreaView,
	KeyboardAvoidingView,
	DeviceEventEmitter,
	ScrollView,
	Dimensions
} from 'react-native';
import { Toast } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import { createService } from '../../api';

// Screens
import ServiceCategory from './ServiceCategory';
import ServiceInformation from './ServiceInformation';
import ServiceLocation from './ServiceLocation';
import ServiceReview from './ServiceReview';

const WIDTH = Dimensions.get('window').width;

const initialState = {
	selectedCategory: undefined,
	selectedSubcategory: undefined,
	title: '',
	phone: '',
	location: '',
	miles: 1,
	description: '',
	loading: false
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
			() => {
				this.setState(initialState);
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
		backPressSubscriptions.add(() => this.props.navigation.navigate('home'));
	};

	showToast = (text, type) => {
		Toast.show({
			text,
			duration: 2000,
			type
		});
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
			const { displayName } = this.props.user;
			const servicePost = {
				selectedCategory,
				selectedSubcategory,
				title,
				phone,
				location,
				description,
				miles,
				displayName
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
							descriptionChange={(description) => this.setState({ description })}
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
							locationChange={(location) => this.setState({ location })}
							milesChange={(miles) => this.setState({ miles })}
							state={{
								location: this.state.location,
								miles: this.state.miles
							}}
						/>
						<ServiceReview
							width={WIDTH}
							// onNext={() => this.props.navigation.navigate('home')}
							onBack={() => this.scrollTo3}
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

export default connect(mapStateToProps)(PublishServiceScreen);
