import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import reducers from './reducers'

const store = createStore(reducers,{},compose(applyMiddleware(thunk)));

export default class App extends React.Component {
  render() {
    return (
        <Provider store={store}>
          <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
          </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
