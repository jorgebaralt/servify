import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	FlatList,
	View,
	ScrollView,
	Text
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { faqList } from '../../shared/data';
import { colors } from '../../shared/styles';
import { ListIcon, CustomHeader } from '../../components/UI';

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

	listText = (faq) => (
		<Text style={{ fontSize: 20, marginRight: 30 }}>{faq.question}</Text>
	);

	rightIcon = () => (
		<Ionicons
			name="ios-arrow-forward"
			style={{ color: colors.secondaryColor }}
			size={24}
		/>
	);

	renderQuestion = (faq) => (
		<ListIcon
			left={this.listText(faq)}
			right={this.rightIcon()}
			onPress={() => {
				this.props.navigation.navigate('specificFaq', { faq });
			}}
			style={{ marginTop: 40 }}
		/>
	);

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => {
				this.props.navigation.goBack();
			}}
		/>
	);

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: 'never' }}>
					<CustomHeader
						color={colors.white}
						title="Help"
						left={this.headerLeftIcon()}
					/>
					<ScrollView style={{ flex: 1 }}>
						<FlatList
							style={{ marginTop: 10, marginBottom: 40 }}
							data={faqList}
							renderItem={({ item }) => this.renderQuestion(item)}
							keyExtractor={(item) => item.id}
							enableEmptySections
						/>
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}

export default HelpScreen;
