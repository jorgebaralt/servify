import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, DeviceEventEmitter, FlatList, Platform } from 'react-native';
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
import { selectFaq } from '../actions';
import { pageHit } from '../helper/ga_helper';

let willFocusSubscription;
let backPressSubscriptions;

class HelpScreen extends Component {
	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Help Screen');
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

	renderQuestion = (faq) => (
		<ListItem
			style={{ marginTop: 30, marginRight: 10 }}
			onPress={() => {
				this.props.selectFaq(faq);
				this.props.navigation.navigate('specificFaq');
			}}
		>
			<Left>
				<Text>{faq.question}</Text>
			</Left>
			<Right>
				<Icon
					name="ios-arrow-forward"
					type="Ionicons"
					style={{ color: 'gray', fontSize: 28 }}
				/>
			</Right>
		</ListItem>
	);

	renderQuestions = () => (
		<FlatList
			style={{ marginTop: 10, marginBottom: 40 }}
			data={this.props.faq}
			renderItem={({ item }) => this.renderQuestion(item)}
			keyExtractor={(item) => item.id}
			enableEmptySections
		/>
	);

	render() {
		const { androidHeader, iosHeader } = styles;
		return (
			<Container>
				<Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
					<Left>
						<Button
							transparent
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
						<Title style={{ color: 'black' }}>Help</Title>
					</Body>
					<Right />
				</Header>
				<Content>{this.renderQuestions()}</Content>
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {}
};

const mapStateToProps = (state) => ({
	faq: state.help
});

export default connect(
	mapStateToProps,
	{ selectFaq }
)(HelpScreen);
