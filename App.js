import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator,createStackNavigator} from 'react-navigation'
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import reducers from './reducers'
import AuthScreen from './screens/AuthScreen'
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';

const store = createStore(reducers,{},compose(applyMiddleware(thunk)));

export default class App extends React.Component {
  render() {

      const MainNavigator = createBottomTabNavigator({
          welcome:{screen:WelcomeScreen},
          auth:{screen:AuthScreen},
          createAccount:{screen:CreateAccountScreen},
          login:{screen:LoginScreen}
          //Main : Already Logged in Screen
      },{
          navigationOptions:{
              // tabBarVisible:false
          }
      });

    return (
        <Provider store={store}>
          <View style={styles.container}>
              <MainNavigator/>
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
