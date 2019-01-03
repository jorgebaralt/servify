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
	Input,
	Item,
	Textarea,
	Toast,
	Spinner
} from 'native-base';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	View,
	Keyboard,
	DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import { deleteService, updateService } from '../../api';

let willFocusSubscription;
let backPressSubscriptions;
class EditServiceScreen extends Component {
	state = {
		title: this.props.service.title,
		description: this.props.service.description,
		phone: this.props.service.phone,
		location:
			this.props.service.locationData.city
			+ ', '
			+ this.props.service.locationData.region
			+ ' '
			+ this.props.service.locationData.postalCode,
		miles: this.props.service.miles,
		loading: false
	};

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Edit Service Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	showToast = (text, type) => {
		this.setState({ loading: false });
		Toast.show({
			text,
			duration: 2000,
			type
		});
	};

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

	deleteService = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		await deleteService(this.props.service);
		this.setState({
			title: '',
			description: '',
			phone: '',
			location: '',
			miles: '',
			loading: false
		});
		this.props.navigation.pop(3);
	};

	openAlert = () => {
		Alert.alert('Delete', 'Are you sure you want to delete this service?', [
			{
				text: 'Delete',
				onPress: () => this.deleteService()
			},
			{
				text: 'Cancel'
			}
		]);
	};

	updateService = async () => {
		Keyboard.dismiss();
		this.setState({ loading: true });
		const updatedService = {
			category: this.props.service.category,
			subcategory: this.props.service.subcategory,
			title: this.state.title,
			phone: this.state.phone,
			location: this.state.location,
			miles: this.state.miles,
			description: this.state.description,
			displayName: this.props.user.displayName,
			email: this.props.user.email,
			ratingCount: this.props.service.ratingCount,
			ratingSum: this.props.service.ratingSum,
			rating: this.props.service.rating,
			favUsers: this.props.service.favUsers
		};
		await updateService(updatedService, (text, type) => this.showToast(text, type));
		this.props.navigation.pop(3);
	};

	phoneChangeText = (text) => {
		const input = text.replace(/\D/g, '').substring(0, 10);
		const left = input.substring(0, 3);
		const middle = input.substring(3, 6);
		const right = input.substring(6, 10);

		if (input.length > 6) {
			this.setState({ phone: `(${left}) ${middle} - ${right}` });
		} else if (input.length > 3) {
			this.setState({ phone: `(${left}) ${middle}` });
		} else if (input.length > 0) {
			this.setState({ phone: `(${left}` });
		}
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner color="orange" />;
		}
		return <View />;
	}

	render() {
		const {
			subtitleStyle,
			contentStyle,
			itemStyle,
			buttonStyle,
			editingTextStyle
		} = styles;
		return (
			<Container>
				<Header>
					<Left>
						<Button
							transparent
							disabled={this.state.loading}
							onPress={() => {
								this.props.navigation.goBack();
							}}
						>
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'black' }}
							/>
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title>Edit your Service</Title>
					</Body>
					<Right>
						<Button
							transparent
							title="Settings"
							onPress={() => this.openAlert()}
							disabled={this.state.loading}
						>
							<Icon
								type="MaterialIcons"
								name="delete"
								style={{ color: '#D84315' }}
							/>
						</Button>
					</Right>
				</Header>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'android' ? 'padding' : null}
					style={{ flex: 1, justifyContent: 'center' }}
				>
					<Content style={contentStyle}>
						<Text style={subtitleStyle}>Title</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.title}
								onChangeText={(text) => this.setState({ title: text })}
								maxLength={25}
							/>
						</Item>
						<Text style={subtitleStyle}>Description</Text>
						<Item bordered regular style={itemStyle}>
							<Textarea
								style={editingTextStyle}
								value={this.state.description}
								rowSpan={3}
								onChangeText={(text) => this.setState({ description: text })}
								maxLength={120}
							/>
						</Item>
						<Text style={subtitleStyle}>Contact Phone</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.phone}
								keyboardType="phone-pad"
								onChangeText={(text) => this.phoneChangeText(text)}
								maxLength={16}
							/>
						</Item>
						<Text style={subtitleStyle}>Location</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.location}
								onChangeText={(text) => this.setState({ location: text })}
							/>
						</Item>
						<Text style={subtitleStyle}>Miles</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.miles}
								keyboardType="numeric"
								onChangeText={(text) => this.setState({ miles: text })}
							/>
						</Item>
						<Button
							bordered
							dark
							disabled={this.state.loading}
							style={buttonStyle}
							onPress={() => this.updateService()}
						>
							<Text style={{ color: '#FF7043' }}>Update Service</Text>
						</Button>
						{this.renderSpinner()}
					</Content>
				</KeyboardAvoidingView>
			</Container>
		);
	}
}
const styles = {
	contentStyle: {
		flex: 1,
		marginTop: 10
	},
	subtitleStyle: {
		marginLeft: '7%',
		marginTop: 10,
		fontWeight: 'bold',
		color: '#4DB6AC',
		fontSize: 16
	},
	itemStyle: {
		marginLeft: '7%',
		marginRight: '7%'
	},
	buttonStyle: {
		top: 20,
		borderColor: '#FF7043',
		left: '6%',
		marginBottom: 20
	},
	editingTextStyle: {
		fontSize: 14
	}
};

const mapStateToProps = (state) => ({
	service: state.selectedService.service,
	user: state.auth.user
});

export default connect(
	mapStateToProps
)(EditServiceScreen);
