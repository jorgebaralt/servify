import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	DeviceEventEmitter,
	ScrollView,
	ActivityIndicator,
	Text
} from 'react-native';
import { Item, Picker, Icon, Toast } from 'native-base';
import { connect } from 'react-redux';
import { createService } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import { Button, FloatingLabelInput, TextArea } from '../../components/UI';
import { colors } from '../../shared/styles';

const maxCharCount = 150;
const initialState = {
	selectedCategory: undefined,
	selectedSubcategory: undefined,
	title: '',
	phone: '',
	location: '',
	miles: '',
	description: '',
	loading: false,
	descriptionCharCount: maxCharCount,
	milesPlaceHolder: '',
	categories
};

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;

class PostServiceScreen extends Component {
	static navigationOptions = {
		title: 'Post',
		tabBarIcon: ({ tintColor }) => (
			<Icon type="Entypo" name="plus" style={{ color: tintColor }} />
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
			}
		);
	}

	componentDidMount() {
		pageHit('Post Service Screen');
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

	doPostService = async () => {
		Keyboard.dismiss();

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
			this.setState({ loading: true });
			await createService(
				servicePost,
				this.props.user.email,
				(text, type) => this.showToast(text, type)
			);
			this.setState({ loading: false });
		} else {
			this.showToast('Please fill all the fields', 'warning');
		}
	};

	// text is only what I have typed, not value
	phoneChangeText = (text) => {
		const input = text.replace(/\D/g, '').substring(0, 10);
		const left = input.substring(0, 3);
		const middle = input.substring(3, 6);
		const right = input.substring(6, 10);

		if (input.length > 6) {
			this.setState({ phone: `(${left}) ${middle} - ${right}` });
		} else if (input.length > 3) {
			this.setState({ phone: `(${left}) ${middle}` });
		} else if (input.length > 1) {
			this.setState({ phone: `(${left}` });
		} else {
			this.setState({ phone: left });
		}
	};

	descriptionChangeText = (text) => {
		this.setState({
			description: text,
			descriptionCharCount: maxCharCount - text.length
		});
	};

	setReference = (scroll) => {
		this.component = scroll;
	};

	renderPickerItemsCategories() {
		const arr = [
			{
				id: '0.0',
				title: 'Pick a category',
				description: 'none',
				dbReference: 'none',
				color: ['#AD1457', '#F06292']
			}
		];
		// add firt option for android
		if (Platform.OS === 'android') {
			const newArray = arr.concat(this.state.categories);
			return newArray.map((category) => (
				<Picker.Item
					key={category.id}
					label={category.title}
					value={category}
				/>
			));
		}
		// ios works fine
		return this.state.categories.map((category) => (
			<Picker.Item
				key={category.id}
				label={category.title}
				value={category}
			/>
		));
	}

	renderPickerItemsSubcategories() {
		const arr = [
			{
				id: '0.0',
				title: 'Pick a Subcategory',
				description: 'none',
				dbReference: 'none',
				color: ['#AD1457', '#F06292']
			}
		];
		if (Platform.OS === 'android') {
			const newArray = arr.concat(
				this.state.selectedCategory.subcategories
			);
			return newArray.map((category) => (
				<Picker.Item
					key={category.id}
					label={category.title}
					value={category}
				/>
			));
		}
		return this.state.selectedCategory.subcategories.map((subcategory) => (
			<Picker.Item
				key={subcategory.id}
				label={subcategory.title}
				value={subcategory}
			/>
		));
	}

	renderPickerIcon = () => (
		<Icon
			name={this.state.selectedSubcategory ? undefined : 'ios-arrow-down'}
			type="Ionicons"
		/>
	);

	// TODO: animate when the new picker appears
	renderSubcategories() {
		if (this.state.selectedCategory) {
			if (this.state.selectedCategory.subcategories) {
				return (
					<Item picker>
						<Picker
							mode="dropdown"
							iosIcon={this.renderPickerIcon()}
							placeholder="Pick a Subcategory"
							placeholderStyle={{ color: '#bfc6ea', left: -15 }}
							selectedValue={this.state.selectedSubcategory}
							onValueChange={(value) => {
								this.setState({ selectedSubcategory: value });
							}}
							textStyle={{ left: -15 }}
						>
							{this.renderPickerItemsSubcategories()}
						</Picker>
					</Item>
				);
			}
		}
		return <View />;
	}

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 100 }}
					size="large"
					color={colors.white}
				/>
			);
		}
		return <View style={{ height: 80 }} />;
	}

	render() {
		const {
			titleStyle,
			formStyle,
			itemStyle,
			textAreaStyle,
			buttonStyle,
			charCountStyle
		} = styles;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'android' ? 'padding' : null}
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<ScrollView
						style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
						ref={(scroll) => {
							this.setReference(scroll);
						}}
					>
						<Text style={titleStyle}>Post a New Service</Text>
						<Item picker style={{ marginTop: 20 }}>
							<Picker
								mode="dropdown"
								style={{ width: undefined }}
								placeholder="Pick a Category"
								placeholderStyle={{
									color: '#bfc6ea',
									left: -15
								}}
								iosIcon={this.renderPickerIcon()}
								selectedValue={this.state.selectedCategory}
								onValueChange={(value) => this.setState({
										selectedCategory: value
									})
								}
								textStyle={{ left: -15 }}
							>
								{this.renderPickerItemsCategories()}
							</Picker>
						</Item>
						{/* If there is subcategory */}
						{this.renderSubcategories()}
						<FloatingLabelInput
							value={this.state.title}
							label="Service title"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ title: text })
							}
							style={{ marginTop: 20 }}
							maxLength={25}
						/>

						<FloatingLabelInput
							value={this.state.phone}
							label="Contact phone"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.phoneChangeText(text)}
							style={{ marginTop: 20 }}
							maxLength={16}
							keyboardType="phone-pad"
						/>

						<FloatingLabelInput
							value={this.state.location}
							label="Address, Zip Code, or Location"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ location: text })
							}
							style={{ marginTop: 20 }}
						/>

						<FloatingLabelInput
							value={this.state.miles}
							label="Miles"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ miles: text })
							}
							maxLength={2}
							style={{ marginTop: 20 }}
							onFocus={() => this.setState({
									milesPlaceHolder: 'Up to 60 miles'
								})
							}
							onBlur={() => this.setState({
									milesPlaceHolder: ''
								})
							}
							placeholder={this.state.milesPlaceHolder}
							keyboardType="numeric"
						/>

						<TextArea
							style={{ marginTop: 20 }}
							label="Description"
							size={40}
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							multiline
							bordered
							numberOfLines={4}
							placeholder="Describe your Service Here"
							maxLength={maxCharCount}
							value={this.state.description}
							onChangeText={(text) => this.descriptionChangeText(text)
							}
						/>
						<View>
							<Text style={charCountStyle}>
								{this.state.descriptionCharCount}
							</Text>
						</View>

						<View>
							<Button
								bordered
								color={colors.primaryColor}
								style={buttonStyle}
								onPress={() => {
									this.doPostService();
									this.component._root.scrollToEnd();
								}}
							>
								Submit
							</Button>
						</View>
						<View>{this.renderSpinner()}</View>
						{/* TODO: Services should be first Submitted for approval. */}
						{/* TODO: Users will also be able to contact you through your account email, create message */}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}
const styles = {
	titleStyle: {
		color: 'black',
		fontSize: 26,
		fontWeight: '600'
	},
	formStyle: {
		width: '95%'
	},
	itemStyle: {
		marginTop: 10
	},
	textAreaStyle: {
		marginTop: 30
	},
	buttonStyle: {
		marginTop: 30,
		marginBottom: 20,
		position: 'absolute',
		right: 0
	},
	charCountStyle: {
		position: 'absolute',
		right: 0,
		color: '#bfc6ea',
		marginBottom: 10
	}
};

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(mapStateToProps)(PostServiceScreen);
