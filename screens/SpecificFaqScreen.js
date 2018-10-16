import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DeviceEventEmitter, FlatList, Platform } from 'react-native';
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
	ListItem
} from 'native-base';
import { deselectFaq } from '../actions';

let willFocusSubscription;
let backPressSubscriptions;

class SpecificFaqScreen extends Component {
	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
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

	render() {
		const { androidHeader, iosHeader, questionStyle, answerStyle } = styles;

		return (
			<Container>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.props.navigation.pop();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'black' }} />
					</Body>
					<Right />
				</Header>
				<Content>
					<Text style={questionStyle}>{this.props.selectedFaq.question}</Text>
					<Text style={answerStyle}>{this.props.selectedFaq.answer}</Text>
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
	questionStyle: {
		fontWeight: 'bold',
		marginTop: 10,
		fontSize: 22,
		marginLeft: 20,
		marginRight: 20
	},
	answerStyle: {
		fontSize: 16,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 40
	}
};

const mapStateToProps = (state) => ({
	selectedFaq: state.selectedFaq.faq
});

export default connect(
	mapStateToProps,
	{ deselectFaq }
)(SpecificFaqScreen);
