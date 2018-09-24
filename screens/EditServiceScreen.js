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
	Toast
} from 'native-base';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { deleteService, resetMessageService } from '../actions';

class EditServiceScreen extends Component {
	state = {
		title: this.props.service.title,
		description: this.props.service.description,
		phone: this.props.service.phone,
		location:
			this.props.service.location.city
			+ ', '
			+ this.props.service.location.region
			+ ' '
			+ this.props.service.zipCode,
		miles: this.props.service.miles
	};

	componentWillUpdate = (nextProps) => {
		const { result } = nextProps;
		const { success, error } = result;
		if (success) {
			Toast.show({
				text: success,
				buttonText: 'OK',
				duration: 3000,
				type: 'success'
			});
			this.props.resetMessageService();
		} else if (error) {
			Toast.show({
				text: error,
				buttonText: 'OK',
				duration: 3000,
				type: 'warning'
			});
			this.props.resetMessageService();
		}
	};

	deleteService = () => {
		this.props.deleteService(this.props.service);
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

	updateService = () => {
		console.log('update service');
	};

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
							onPress={() => {
								this.props.navigation.goBack();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
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
								onChangeText={(text) => this.setState({ title: text })}
								maxLength={120}
							/>
						</Item>
						<Text style={subtitleStyle}>Contact Phone</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.phone}
								keyboardType="phone-pad"
								onChangeText={(text) => this.setState({ title: text })}
							/>
						</Item>
						<Text style={subtitleStyle}>Location</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.location}
								onChangeText={(text) => this.setState({ title: text })}
							/>
						</Item>
						<Text style={subtitleStyle}>Miles</Text>
						<Item bordered regular style={itemStyle}>
							<Input
								style={editingTextStyle}
								value={this.state.miles}
								keyboardType="numeric"
								onChangeText={(text) => this.setState({ title: text })}
							/>
						</Item>
						<Button
							bordered
							dark
							style={buttonStyle}
							onPress={() => this.updateService()}
						>
							<Text style={{ color: '#FF7043' }}>Update Service</Text>
						</Button>
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
	result: state.serviceResult
});

export default connect(
	mapStateToProps,
	{ deleteService, resetMessageService }
)(EditServiceScreen);
