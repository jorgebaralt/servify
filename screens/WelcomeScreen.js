import React, {Component} from 'react';
import {View, Text, AsyncStorage, StyleSheet} from 'react-native';
import Slides from '../components/Slides';
import _ from 'lodash';
import {AppLoading} from'expo'

class WelcomeScreen extends Component{

    render(){
        return(
           <View >
               <Text> Welcome Screen</Text>
               <Text> Welcome Screen</Text>
               <Text> Welcome Screen</Text>
               <Text> Welcome Screen</Text>
               <Text> Welcome Screen</Text>
           </View>
        )
    }
}
export default WelcomeScreen;