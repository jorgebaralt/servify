import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	FlatList,
	View,
	ScrollView,
	SafeAreaView,
	Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { faqList } from '../../shared/data';
import { colors, globalStyles } from '../../shared/styles';
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
		const { androidHeader, iosHeader } = styles;
		return (
			<View style={globalStyles.whiteHeader}>
				{/* <Header style={Platform.OS === 'android' ? androidHeader : iosHeader}>
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
				</Header> */}
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView style={{ flex: 1 }}>
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

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {}
};

export default HelpScreen;
