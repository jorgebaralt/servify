import React, {Component} from 'react';
import Slides from '../components/Slides';
import Expo, {AppLoading} from 'expo';
import _ from 'lodash';
import firebase from 'firebase';

const SLIDE_DATA=[
    {text:'Welcome to Servify', color:'#FFB300'},
    {text:'Easy way to Find a Service Brought to your Home', color:'#00E676'},
    {text:'Post or Find Help from any Professional Registered', color:'#03A9F4'}
];

class WelcomeScreen extends Component{

    state ={
        loading : true,
        authenticated : null
    };

    async componentWillMount(){

        //check if there is a user logged in already
         await this.checkForUser();
         //Make sure to load the Native Base Fonts
         await this.loadFonts()
    }

    async checkForUser(){
        //TODO: for testing Log out
        //  firebase.auth().signOut().then(()=>{console.log('Logging out')});

        firebase.auth().onAuthStateChanged((user) =>{
            if (user) {
                this.props.navigation.navigate('main');
                this.setState({authenticated:true});
            } else {
                // No user is signed in.
                this.setState({authenticated:false})
            }
        });

    }

    async loadFonts(){
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });
        this.setState({loading : false})
    }

    onSlidesComplete=()=>{
        this.props.navigation.navigate('auth');
    };

    render(){
        //if we are still loading font or we have not checked for token
        if(this.state.loading || _.isNull(this.state.authenticated)){
            return (<AppLoading/>)
        }
        return(
            <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete}/>
        )
    }
}
export default WelcomeScreen;