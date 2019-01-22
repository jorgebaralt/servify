import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	ActivityIndicator,
	SafeAreaView,
	Text,
	Keyboard,
	ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { showToast } from '../../actions';
import { submitFeedback } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';
import {
	CustomHeader,
	ListPicker,
	Button,
	TextArea
} from '../../components/UI';

let willFocusSubscription;
let backPressSubscriptions;

const initialState = {
	selectedOption: undefined,
	description: '',
	loading: false,
	modalVisible: false
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
	};

	showToast = (text, type) => {
		this.props.showToast({ message: text, type, duration: 1500 });
		if (type === 'success') {
			this.clearState();
			this.onBackPress();
		}
	};

	onBackPress = () => {
		this.props.navigation.pop();
	};

	sendFeedback = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const feedback = {
			uid: this.props.user.uid,
			option: this.state.selectedOption.title,
			description: this.state.description
		};
		await submitFeedback(feedback, (text, type) => this.showToast(text, type));
	};

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => this.onBackPress()}
		/>
	);

	renderSpinner() {
		if (this.state.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 10 }}
					size="large"
					color={colors.primaryColor}
				/>
			);
		}
		return <View />;
	}

	renderDescription() {
		if (this.state.selectedOption) {
			return (
				<View>
					<TextArea
						style={{ marginTop: 30 }}
						label="Description"
						size={40}
						firstColor={colors.darkGray}
						secondColor={colors.secondaryColor}
						fontColor={colors.black}
						multiline
						bordered
						numberOfLines={3}
						placeholder="Enter thoughts here..."
						value={this.state.description}
						onChangeText={(text) => this.setState({description: text})}
					/>
					<Button
						bordered
						disabled={this.state.loading || this.state.description.length < 2}
						style={{ marginTop: 20 }}
						color={colors.primaryColor}
						onPress={() => this.sendFeedback()}
						textColor={colors.primaryColor}
					>
						<Text>Submit</Text>
					</Button>
					{this.renderSpinner()}
				</View>
			);
		}
	}

	render() {
		const {
			DescriptionStyle,
			titleStyle,
		} = styles;
		return (
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView style={{ flex: 1}}>
					<CustomHeader
						color={colors.white}
						title="Feedback"
						left={this.headerLeftIcon()}
					/>
					<ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text style={titleStyle}>How can we improve?</Text>
						<Text style={DescriptionStyle}>
							We are always looking for ways to improve, so we
							listen very close to every feedback. Please tell us
							what you love or where to get better.
						</Text>

						<ListPicker
							onPress={() => this.setState({ modalVisible: true })
							}
							visible={this.state.modalVisible}
							callback={(selectedOption) => {
								this.setState({
									modalVisible: false,
									selectedOption
								});
							}}
							label="Feedback type"
							selected={this.state.selectedOption}
							placeholder="Pick an option"
							title="Pick an option"
							color={colors.secondaryColor}
							data={[
								{ title: 'Give some feedback' },
								{ title: 'Report a bug' }
							]}
							style={{ marginTop: 30 }}
						/>
						{this.renderDescription()}
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = {
	DescriptionStyle: {
		marginTop: 20,
		fontSize: 16
	},
	titleStyle: {
		marginTop: 20,
		fontSize: 20,
		fontWeight: 'bold'
	}
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps, { showToast })(FeedbackScreen);
