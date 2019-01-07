import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {
	createBottomTabNavigator,
	createStackNavigator
} from 'react-navigation';
import { Root } from 'native-base';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';
import reducers from './reducers';
import { firebaseKey } from './config/keys';
// Screens
import AuthScreen from './screens/AuthScreens/AuthScreen';
import WelcomeScreen from './screens/AuthScreens/WelcomeScreen';
import CreateAccountScreen from './screens/AuthScreens/CreateAccountScreen';
import LoginScreen from './screens/AuthScreens/LoginScreen';
import HomeScreen from './screens/BottomTabsScreens/HomeScreen';
import BrowseScreen from './screens/BottomTabsScreens/BrowseScreen';
import PublishServiceInfo from './screens/BottomTabsScreens/PublishServiceInfo';
import ProfileScreen from './screens/BottomTabsScreens/ProfileScreen';
import SettingsScreen from './screens/ProfileScreens/SettingsScreen';
import ServicesListScreen from './screens/BrowseScreens/ServicesListScreen';
import SubcategoriesListScreen from './screens/BrowseScreens/SubcategoriesListScreen';
import SpecificServiceScreen from './screens/ServiceScreens/SpecificServiceScreen';
import ProfileServicesScreen from './screens/ProfileScreens/ProfileServicesScreen';
import FeedbackScreen from './screens/ProfileScreens/FeedbackScreen';
import EditServiceScreen from './screens/ServiceScreens/EditServiceScreen';
import ForgotPasswordScreen from './screens/AuthScreens/ForgotPasswordScreen';
import ReviewsScreen from './screens/ServiceScreens/ReviewsScreen';
import HelpScreen from './screens/ProfileScreens/HelpScreen';
import SpecificFaqScreen from './screens/ProfileScreens/SpecificFaqScreen';
import ReportScreen from './screens/ServiceScreens/ReportScreen';
import PublishServiceScreen from './screens/PublishService/PublishServiceScreen';
// Style
import { colors } from './shared/styles';

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));
export default class App extends React.Component {
	componentWillMount() {
		firebase.initializeApp({
			apiKey: firebaseKey,
			authDomain: 'servify-716c6.firebaseapp.com',
			databaseURL: 'https://servify-716c6.firebaseio.com',
			projectId: 'servify-716c6',
			storageBucket: 'servify-716c6.appspot.com',
			messagingSenderId: '737506787644'
		});
	}

	render() {
		// Main - Second Navigation
		const Main = createBottomTabNavigator(
			{
				home: { screen: HomeScreen },
				browse: { screen: BrowseScreen },
				publishInfo: { screen: PublishServiceInfo },
				profile: { screen: ProfileScreen }
			},
			{
				tabBarOptions: {
					showLabel: true,
					activeTintColor: colors.primaryColor,
					inactiveTintColor: colors.black,
					labelStyle: {
						fontSize: 12
					},
					style: {
						// backgroundColor: '#FF7043'
					},
					tabStyle: {
						paddingVertical: 0
					}
				}
			}
		);
		// Welcome - First Navigation
		const WelcomeNavigator = createBottomTabNavigator(
			{
				welcome: { screen: WelcomeScreen },
				auth: { screen: AuthScreen },
				createAccount: { screen: CreateAccountScreen },
				login: { screen: LoginScreen },
				forgotPassword: { screen: ForgotPasswordScreen },
				main: { screen: Main }
			},
			{
				navigationOptions: {
					tabBarVisible: false
				}
			}
		);

		// ROOT NAVIGATION
		const RootNavigation = createStackNavigator(
			{
				initial: WelcomeNavigator,
				settings: { screen: SettingsScreen },
				servicesList: { screen: ServicesListScreen },
				subcategories: { screen: SubcategoriesListScreen },
				service: { screen: SpecificServiceScreen },
				editService: { screen: EditServiceScreen },
				profileService: { screen: ProfileServicesScreen },
				feedback: { screen: FeedbackScreen },
				reviews: { screen: ReviewsScreen },
				help: { screen: HelpScreen },
				specificFaq: { screen: SpecificFaqScreen },
				report: { screen: ReportScreen },
				publish: { screen: PublishServiceScreen }
			},
			{
				headerMode: 'none'
			}
		);

		return (
			<Provider store={store}>
				<View
					style={[
						styles.container,
						{
							paddingTop:
								Platform.OS === 'android' ? StatusBar.currentHeight : 0
						}
					]}
				>
					<Root>
						<RootNavigation />
					</Root>
				</View>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	}
});
