import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	Keyboard,
	DeviceEventEmitter,
	ScrollView,
	ActivityIndicator,
	Text
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Toast } from 'native-base';
import { connect } from 'react-redux';
import { createService } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import { formatPhone } from '../../shared/helpers';
import {
	Button,
	FloatingLabelInput,
	TextArea,
	ListPicker
} from '../../components/UI';
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
	categories,
	categoryModalVisible: false,
	subcategoryModalVisible: false
};

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;

class PostServiceScreen extends Component {
	static navigationOptions = {
		title: 'Post',
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

	// On button submit
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
			this.setState({ loading: false });
		} else {
			this.showToast('Please fill all the fields', 'warning');
		}
	};

	// format phone text
	phoneChangeText = (text) => {
		const result = formatPhone(text);
		this.setState({ phone: result });
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

	// TODO: animate when the new picker appears
	renderSubcategoriesPicker() {
		if (this.state.selectedCategory) {
			if (this.state.selectedCategory.subcategories) {
				return (
					<ListPicker
						onPress={() => this.setState({ subcategoryModalVisible: true })
						}
						visible={this.state.subcategoryModalVisible}
						callback={(selectedSubcategory) => this.setState({
								subcategoryModalVisible: false,
								selectedSubcategory
							})
						}
						label="Subcategory"
						selected={this.state.selectedSubcategory}
						placeholder="Pick a subcategory"
						title="Pick a subcategory"
						data={this.state.selectedCategory.subcategories}
						style={{ marginTop: 50 }}
					/>
				);
			}
		}
		return <View />;
	}

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 20 }}
					size="large"
					color={colors.primaryColor}
				/>
			);
		}
	}

	render() {
		const { titleStyle, buttonStyle, charCountStyle } = styles;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<KeyboardAvoidingView
					behavior="padding"
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<ScrollView
						style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}
						keyboardShouldPersistTaps="always"
						ref={(scroll) => {
							this.setReference(scroll);
						}}
					>
						<Text style={titleStyle}>Post a New Service</Text>
						<ListPicker
							onPress={() => this.setState({ categoryModalVisible: true })
							}
							visible={this.state.categoryModalVisible}
							callback={(selectedCategory) => this.setState({
								categoryModalVisible: false,
								selectedCategory,
								selectedSubcategory: undefined
							})
							}
							label="Category"
							selected={this.state.selectedCategory}
							placeholder="Pick a category"
							title="Pick a category"
							data={this.state.categories}
							style={{ marginTop: 30 }}
						/>
						{/* If there is subcategory */}
						{this.renderSubcategoriesPicker()}
						{/* Service Title */}
						<FloatingLabelInput
							value={this.state.title}
							label="Service title"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ title: text })
							}
							style={{ marginTop: 30 }}
							maxLength={25}
						/>
						{/* Phone */}
						<FloatingLabelInput
							value={this.state.phone}
							label="Contact phone"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.phoneChangeText(text)}
							style={{ marginTop: 30 }}
							maxLength={16}
							keyboardType="phone-pad"
						/>
						{/* Address */}
						<FloatingLabelInput
							value={this.state.location}
							label="Address, Zip Code, or Location"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ location: text })
							}
							style={{ marginTop: 30 }}
						/>
						{/* Miles */}
						<FloatingLabelInput
							value={this.state.miles}
							label="Miles"
							firstColor={colors.darkGray}
							secondColor={colors.primaryColor}
							fontColor={colors.black}
							onChangeText={(text) => this.setState({ miles: text })
							}
							maxLength={2}
							style={{ marginTop: 30 }}
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
						{/* Description */}
						<TextArea
							style={{ marginTop: 30 }}
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
						{/* Description char count */}
						<View>
							<Text style={charCountStyle}>
								{this.state.descriptionCharCount}
							</Text>
						</View>
						{/* Submit */}
						<View style={{ height: 100 }}>
							<Button
								bordered
								color={colors.primaryColor}
								style={buttonStyle}
								onPress={() => {
									this.doPostService();
								}}
							>
								Submit
							</Button>
						</View>
						{this.renderSpinner()}
						{/* TODO: Services should be first Submitted for approval. */}
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
		right: 0,
		position: 'absolute'
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
