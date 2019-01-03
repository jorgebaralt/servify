import React, { Component } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
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
} from 'native-base';
import { pageHit } from '../../shared/ga_helper';

let willFocusSubscription;
let backPressSubscriptions;

class SpecificFaqScreen extends Component {
	state = { selectedFaq: null };
	
	async componentWillMount() {
		await this.setState({ selectedFaq: this.props.navigation.getParam('faq') });
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Specific FAQ Screen');
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
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'black' }}
							/>
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'black' }} />
					</Body>
					<Right />
				</Header>
				<Content>
					<Text style={questionStyle}>{this.state.selectedFaq.question}</Text>
					<Text style={answerStyle}>{this.state.selectedFaq.answer}</Text>
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

export default SpecificFaqScreen;
