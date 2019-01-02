import React, { Component } from 'react';
import { View, DeviceEventEmitter, ScrollView, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { pageHit } from '../../shared/ga_helper';
import { Button, FadeImage, InfoImage } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { One, Two, Three } from '../../assets/svg/Numbers';
import { Checkmark } from '../../assets/svg';

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;

class PostServiceScreen extends Component {
	static navigationOptions = {
		title: 'Publish',
		tabBarIcon: ({ tintColor }) => (
			<Entypo name="plus" size={32} style={{ color: tintColor }} />
		)
	};

	componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
		//
		willBlurSubscription = this.props.navigation.addListener(
			'willBlur',
			() => {}
		);
	}

	componentDidMount() {
		pageHit('Publish service info');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscription.remove();
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
		backPressSubscriptions.add(() => this.props.navigation.navigate('home'));
	};

	render() {
		return (
			<ScrollView
				style={{ backgroundColor: '#FFFFFF' }}
				keyboardShouldPersistTaps="always"
			>
				<InfoImage
					image={require('../../assets/backgrounds/overview.jpeg')}
					buttonText="Publish a service"
					text="Increase your customers by hosting your services on Servify"
					textColor={colors.white}
					buttonColor={colors.primaryColor}
					opacity={0.35}
					disablePress
				>
					<View
						style={{
							position: 'absolute',
							left: 10,
							bottom: 20,
							right: 0,
							justifyContent: 'space-between',
							flexDirection: 'row'
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: 26,
								fontWeight: '600',
								marginBottom: 10
							}}
						>
							Ready to grow?
						</Text>
						<Button
							bordered
							onPress={() => {
								this.props.navigation.navigate('publish');
							}}
							style={{marginRight: 10}}
						>
							Get started
						</Button>
					</View>
				</InfoImage>
				<View style={{ paddingLeft: 20, paddingRight: 20 }}>
					<Text
						style={[
							globalStyles.sectionTitle,
							{ color: colors.secondaryColor }
						]}
					>
						Why choose us?
					</Text>
					<Text style={styles.descriptionStyle}>
						Servify allows users to publish any type of service free
						of price, where customers can find your service easily
					</Text>
					<Text
						style={[
							globalStyles.sectionTitle,
							{ color: colors.secondaryColor }
						]}
					>
						Our Goal
					</Text>
					<Text style={styles.descriptionStyle}>
						We want to provide a platform that anyone can use and
						find any service in an easy and user-friendly way.
					</Text>
					<Text
						style={[
							globalStyles.sectionTitle,
							{ color: colors.secondaryColor }
						]}
					>
						How to publish a service
					</Text>
					<View>
						<View style={styles.publishContainer}>
							<One width={40} height={40} />
							<View style={{ marginLeft: 20, marginRight: 20 }}>
								<Text style={styles.subtitleStyle}>
									Fill your service information
								</Text>
								<Text style={styles.descriptionStyle}>
									Enter basic information about the service
									that you provide
								</Text>
							</View>
						</View>

						<View style={styles.publishContainer}>
							<Two width={40} height={40} />
							<View style={{ marginLeft: 20, marginRight: 20 }}>
								<Text style={styles.subtitleStyle}>
									Publish your service
								</Text>
								<Text style={styles.descriptionStyle}>
									Once published, users will able to find you
									on the browse section
								</Text>
							</View>
						</View>

						<View style={styles.publishContainer}>
							<Three width={40} height={40} />
							<View style={{ marginLeft: 20, marginRight: 20 }}>
								<Text style={styles.subtitleStyle}>
									Get contacted by customers
								</Text>
								<Text style={styles.descriptionStyle}>
									Users can see your information, and contact
									you through the app
								</Text>
							</View>
						</View>
					</View>
					<Text
						style={[
							globalStyles.sectionTitle,
							{ color: colors.secondaryColor }
						]}
					>
						What customers will see
					</Text>
					<View style={styles.publishContainer}>
						<View style={{ width: '50%', height: 'auto' }}>
							<FadeImage
								image={require('../../assets/backgrounds/happy.jpg')}
								style={{ height: 280, borderRadius: 8 }}
							/>
						</View>

						<View
							style={{
								width: '50%',
								marginLeft: 20,
								marginRight: 20
							}}
						>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Reviews and rating of your service
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Service category and price rating
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Your contact information
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Location displayed in a map
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Information about you and the service
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Easy way to contact you
								</Text>
							</View>
							<View style={styles.customerSeeContainer}>
								<Checkmark style={{ marginTop: 2 }} />
								<Text style={styles.smallTextStyle}>
									Option to add to favorites
								</Text>
							</View>
						</View>
					</View>
					<Button
						style={styles.buttonStyle}
						color={colors.primaryColor}
						onPress={() => {
							this.props.navigation.navigate('publish');
						}}
					>
						Publish a service
					</Button>
				</View>
			</ScrollView>
		);
	}
}
const styles = {
	descriptionStyle: { fontSize: 16, color: colors.darkerGray },
	subtitleStyle: { fontSize: 18, fontWeight: '500' },
	publishContainer: { flexDirection: 'row', marginTop: 10, marginRight: 20 },
	smallTextStyle: {
		fontSize: 14,
		color: colors.darkerGray,
		marginLeft: 5,
		marginRight: 20
	},
	customerSeeContainer: { flexDirection: 'row', marginTop: 5 },
	buttonStyle: {
		width: '100%',
		marginTop: 10,
		marginBottom: 40
	}
};

function mapStateToProps(state) {
	return {
		user: state.auth.user
	};
}

export default connect(mapStateToProps)(PostServiceScreen);
