import React, { Component } from 'react';
import Expo, { AppLoading } from 'expo';
import { View, UIManager, Platform } from 'react-native';
import _ from 'lodash';
import firebase from 'firebase';
import { connect } from 'react-redux';
import Slides from '../components/Slides';
import { getFavorites, getEmail } from '../actions';

const SLIDE_DATA = [
    { text: 'Welcome to Servify', color: '#FFB300' },
    { text: 'Easy way to Find a Service Brought to your Home', color: '#00E676' },
    { text: 'Post or Find Help from any Professional Registered', color: '#03A9F4' }
];

class WelcomeScreen extends Component{
    state ={
        loading: true,
        authenticated: null
    };

    async componentWillMount() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        // check if there is a user logged in already
         await this.checkForUser();
         // Make sure to load the Native Base Fonts
         await this.loadFonts();
    }

    onSlidesComplete=() => {
      this.props.navigation.navigate('auth');
    };

    async checkForUser(){
        // TODO: for testing Log out
        //  firebase.auth().signOut().then(() => { console.log('Logging out'); });
        // this checks for user on the first screen on the app
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                await this.props.getEmail();
                if(this.props.email){
                    this.props.getFavorites(this.props.email);
                }
                this.props.navigation.navigate('main');
                this.setState({ authenticated: true });
            } else {
                // No user is signed in.
                this.setState({ authenticated: false });
            }
        });
    }

    async loadFonts(){
        await Expo.Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });
        this.setState({ loading: false });
    }

    render(){
        // if we are still loading font or we have not checked for token
        if(this.state.loading || _.isNull(this.state.authenticated)){
            return (<AppLoading />);
        }
        return(
            <View style={{ flex: 1 }}>
                <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete} />
            </View>
        );
    }
}
function mapStateToProps(state){
    return{
        email: state.auth.email
    };
}

export default connect(mapStateToProps, { getFavorites, getEmail })(WelcomeScreen);
