import React, { Component } from 'react';
import { View, Platform, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import {
	Content,
	Header,
	Text,
	Body,
	Title,
	Container,
	Left,
	Button,
	Icon,
	Right,
	Form,
	Item,
	Picker,
	Textarea,
	Toast
} from 'native-base';
import { connect } from 'react-redux';
import { submitFeedback } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let backPressSubscriptions;

const initialState = {
	selectedOption: undefined,
	description: '',
	loading: false
};
class FeedbackScreen extends Component {
	state = initialState;

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Feedback Screen');
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

	clearState = () => {
		this.setState(initialState);
	}

	showToast = (text, type) => {
		Toast.show({
			text,
			duration: 2000,
			type
		});
		if (type === 'success') {
			this.clearState();
			this.onBackPress();
		}
	};

	onBackPress = () => {
		this.props.navigation.goBack(null);
	};

	sendFeedback = async () => {
		this.setState({ loading: true });
		const feedback = {
			email: this.props.user.email,
			option: this.state.selectedOption,
			description: this.state.description
		};
		await submitFeedback(feedback, (text, type) => this.showToast(text, type));
	};

	renderPicker = () => {
		let pickerArr;
		if (Platform.OS === 'android') {
			pickerArr = [
				{ label: 'Pick an option', value: 'none' },
				{ label: 'Give some feedback', value: 'feedback' },
				{ label: 'Report a bug', value: 'bug' }
			];
		} else {
			pickerArr = [
				{ label: 'Give some feedback', value: 'feedback' },
				{ label: 'Report a bug', value: 'bug' }
			];
		}
		return pickerArr.map((picker, i) => (
			<Picker.Item key={i} label={picker.label} value={picker.value} />
		));
	};

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
		return <View />;
	}

	renderDescription() {
		const { textAreaStyle, buttonStyle } = styles;
		if (this.state.selectedOption) {
			return (
				<View>
					<Textarea
						style={textAreaStyle}
						rowSpan={5}
						bordered
						placeholder="Describe here..."
						value={this.state.description}
						onChangeText={(text) => this.setState({ description: text })
						}
					/>
					<Button
						bordered
						dark
						disabled={this.state.loading}
						style={buttonStyle}
						onPress={() => this.sendFeedback()}
					>
						<Text style={{ color: '#FF7043' }}>Submit</Text>
					</Button>
					{this.renderSpinner()}
				</View>
			);
		}
	}

	render() {
		const {
			formStyle,
			DescriptionStyle,
			titleStyle,
			androidHeader,
			iosHeader
		} = styles;
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
						>
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'black' }}
							/>
						</Button>
					</Left>
					<Body>
						<Title style={{ color: 'black', marginLeft: 10 }}>
							Feedback
						</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					<Text style={titleStyle}>How can we improve?</Text>
					<Text style={DescriptionStyle}>
						We are always looking for ways to improve, so we listen
						very close to every feedback. Please tell us what you
						love or where to improve.
					</Text>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Form style={formStyle}>
							<Item picker style={{ margin: 20, width: '100%' }}>
								<Picker
									mode="dropdown"
									style={{ width: undefined }}
									placeholder="Pick an Option"
									placeholderStyle={{
										color: '#bfc6ea',
										left: -15
									}}
									iosIcon={(
<Icon
											name={
												this.state.selectedOption
													? undefined
													: 'ios-arrow-down'
											}
/>
)}
									selectedValue={this.state.selectedOption}
									onValueChange={(value) => this.setState({ selectedOption: value })
									}
									textStyle={{ left: -15 }}
								>
									{this.renderPicker()}
								</Picker>
							</Item>
							{this.renderDescription()}
						</Form>
					</View>
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
	formStyle: {
		width: '80%'
	},
	textAreaStyle: {
		marginTop: 10,
		fontSize: 16
	},
	DescriptionStyle: {
		marginTop: 20,
		marginLeft: '10%',
		marginRight: '10%',
		fontSize: 16
	},
	titleStyle: {
		marginLeft: '10%',
		marginRight: '10%',
		marginTop: 20,
		fontSize: 20,
		fontWeight: 'bold'
	},
	buttonStyle: {
		top: 20,
		borderColor: '#FF7043',
		marginBottom: 20
	}
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(FeedbackScreen);
