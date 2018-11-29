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
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BrowseScreen from './screens/BrowseScreen';
import PostServiceScreen from './screens/PostServiceScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ServicesListScreen from './screens/ServicesListScreen';
import SubcategoriesListScreen from './screens/SubcategoriesListScreen';
import SpecificServiceScreen from './screens/SpecificServiceScreen';
import ProfileServicesScreen from './screens/ProfileServicesScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import HelpScreen from './screens/HelpScreen';
import SpecificFaqScreen from './screens/SpecificFaqScreen';
import ReportScreen from './screens/ReportScreen';

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
				postService: { screen: PostServiceScreen },
				profile: { screen: ProfileScreen }
			},
			{
				tabBarOptions: {
					showLabel: true,
					activeTintColor: '#FF7043',
					inactiveTintColor: '#000',
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
				report: { screen: ReportScreen }
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
		backgroundColor: '#fff'
	}
});
