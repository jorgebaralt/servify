import React from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator,createStackNavigator} from 'react-navigation'
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import firebase from 'firebase';
import reducers from './reducers'
import {Root} from 'native-base'
//Screens
import AuthScreen from './screens/AuthScreen'
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen'
import BrowseScreen from './screens/BrowseScreen';
import PostServiceScreen from './screens/PostServiceScreen'
import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'

const store = createStore(reducers,{},compose(applyMiddleware(thunk)));
export default class App extends React.Component {

    componentWillMount(){
        firebase.initializeApp({
            apiKey: "AIzaSyBlfkH3vO25hXrejXrSeWRlejfETYUfb6I",
            authDomain: "servify-716c6.firebaseapp.com",
            databaseURL: "https://servify-716c6.firebaseio.com",
            projectId: "servify-716c6",
            storageBucket: "servify-716c6.appspot.com",
            messagingSenderId: "737506787644"
        })
    }

  render() {
        let ProfileStack = createStackNavigator({
            profile:ProfileScreen,
            settings:SettingsScreen
        },{
            headerMode: 'none',
            navigationOptions: {
                headerVisible: false,
            }});
        //Main - Second Navigation
        let Main = createBottomTabNavigator({
            home:{screen:HomeScreen},
            browse:{screen:BrowseScreen},
            postService:{screen:PostServiceScreen},
            profile:ProfileStack
        });
        //Welcome - First Navigation
        const MainNavigator = createBottomTabNavigator({
            welcome:{screen:WelcomeScreen},
            auth:{screen:AuthScreen},
            createAccount:{screen:CreateAccountScreen},
            login:{screen:LoginScreen},
            main: Main
          },{
              navigationOptions:{
                   tabBarVisible:false
              }
          });

        return (
            <Provider store={store}>
              <View style={[styles.container,{paddingTop: Platform.OS==='android' ? StatusBar.currentHeight : 0}]}>
                <Root>
                    <MainNavigator/>
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
      },
    });
