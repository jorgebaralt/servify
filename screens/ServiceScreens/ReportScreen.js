import React, { Component } from 'react';
import { Toast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
	View,
	DeviceEventEmitter,
	SafeAreaView,
	ActivityIndicator,
	Text,
	ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { reportService } from '../../api';
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

	// send report to database
	sendReport = async () => {
		this.setState({ loading: true });
		const report = {
			reason: this.state.selectedOption,
			description: this.state.description,
			serviceTitle: this.props.service.title,
			serviceOwner: this.props.service.email
		};
		await reportService(report);
		this.setState({ loading: false });
		Toast.show({
			text: 'Service reported',
			buttonText: 'OK',
			duration: 5000,
			type: 'success'
		});
		this.onBackPress();
	};

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => {
				this.props.navigation.navigate('browse');
			}}
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

	// after user has picked an option, we render description
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
						onChangeText={(text) => this.setState({ description: text })
						}
					/>
					<Button
						bordered
						disabled={
							this.state.loading
							|| this.state.description.length < 2
						}
						style={{ marginTop: 20 }}
						color={colors.primaryColor}
						onPress={() => this.sendReport()}
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
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView style={{ flex: 1}}>
					<CustomHeader
						color={colors.white}
						title="Report"
						left={this.headerLeftIcon()}
					/>
					<ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
						<Text style={titleStyle}>Report a service</Text>
						<Text style={DescriptionStyle}>
							Does
							<Text style={{ fontWeight: 'bold' }}>
								{' '}
								{this.props.service.title}{' '}
							</Text>
							contains anything offensive, innapropiate, or fake?
							please report it as soon as possible so we can take
							a closer look.
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
							label="Report type"
							selected={this.state.selectedOption}
							placeholder="Pick an option"
							title="Pick an option"
							color={colors.secondaryColor}
							data={[
								{ title: 'Offensive information' },
								{ title: 'Fake information' }
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
	},
};

const mapStateToProps = (state) => ({ service: state.selectedService.service });

export default connect(mapStateToProps)(ReportScreen);
