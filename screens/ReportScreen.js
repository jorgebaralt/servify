import React, { Component } from 'react';
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
	Item,
	Textarea,
	Toast,
	Spinner,
	Form,
	Picker
} from 'native-base';
import { Platform, View, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { reportService } from '../actions';
import { pageHit } from '../helper/ga_helper';

let willFocusSubscription;
let backPressSubscriptions;
const initialState = {
	selectedOption: undefined,
	description: '',
	loading: false
};

class ReportScreen extends Component {
	state = initialState;

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Report Screen');
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

	onBackPress = () => {
		this.props.navigation.goBack(null);
	};

	sendReport = async () => {
		this.setState({ loading: true });

		const report = {
			reason: this.state.selectedOption,
			description: this.state.description,
			serviceTitle: this.props.service.title,
			serviceOwner: this.props.service.email
		};
		await this.props.reportService(report);
		this.setState({ loading: false });
		Toast.show({
			text: 'Service reported',
			buttonText: 'OK',
			duration: 5000,
			type: 'success'
		});
		this.onBackPress();
	};

	renderPicker = () => {
		let pickerArr;
		if (Platform.OS === 'android') {
			pickerArr = [
				{ label: 'Pick an option', value: 'none' },
				{ label: 'Fake information', value: 'fake' },
				{ label: 'Offensive information', value: 'offensive' }
			];
		} else {
			pickerArr = [
				{ label: 'Offensive information', value: 'offensive' },
				{ label: 'Fake information', value: 'fake' }
			];
		}
		return pickerArr.map((picker, i) => (
			<Picker.Item key={i} label={picker.label} value={picker.value} />
		));
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner color="orange" />;
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
						onChangeText={(text) => this.setState({ description: text })}
					/>
					{this.renderSpinner()}
					<Button
						bordered
						dark
						disabled={this.state.loading}
						style={buttonStyle}
						onPress={() => this.sendReport()}
					>
						<Text style={{ color: '#FF7043' }}>Report</Text>
					</Button>
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
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
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
						<Title style={{ color: 'black', marginLeft: 10 }}>Report</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					<Text style={titleStyle}>Report a service</Text>
					<Text style={DescriptionStyle}>
						Does
						<Text style={{ fontWeight: 'bold' }}>
							{' '}
							{this.props.service.title}{' '}
						</Text>
						contains anything offensive, innapropiate, or fake? please report it
						as soon as possible so we can take a closer look.
					</Text>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Form style={formStyle}>
							<Item picker style={{ margin: 20, width: '100%' }}>
								<Picker
									mode="dropdown"
									style={{ width: undefined }}
									placeholder="Pick an Option"
									placeholderStyle={{ color: '#bfc6ea', left: -15 }}
									iosIcon={(
<Icon
											name={
												this.state.selectedOption
													? undefined
													: 'ios-arrow-down-outline'
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

const mapStateToProps = (state) => ({ service: state.selectedService.service });

export default connect(
	mapStateToProps,
	{ reportService }
)(ReportScreen);
