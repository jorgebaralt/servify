import React, { Component } from 'react';
import {
	View,
	DeviceEventEmitter,
	SafeAreaView,
	Text,
	ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';
import { CustomHeader } from '../../components/UI';

let willFocusSubscription;
let backPressSubscriptions;

class SpecificFaqScreen extends Component {
	state = { selectedFaq: null };

	async componentWillMount() {
		await this.setState({
			selectedFaq: this.props.navigation.getParam('faq')
		});
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

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.white }}
			onPress={() => {
				this.props.navigation.pop();
			}}
		/>
	);

	render() {
		const { answerStyle } = styles;

		return (
			<View style={{ flex: 1, backgorundColor: colors.white }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.secondaryColor
					}}
				/>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: colors.white }}
				>
					<CustomHeader
						color={colors.secondaryColor}
						left={this.headerLeftIcon()}
						span
						height={150}
						title={this.state.selectedFaq.question}
						titleColor={colors.white}
						titleMarginTop={50}
					/>
					<ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Text style={answerStyle}>
							{this.state.selectedFaq.answer}
						</Text>
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = {
	answerStyle: {
		fontSize: 20,
		marginTop: 40
	}
};

export default SpecificFaqScreen;
