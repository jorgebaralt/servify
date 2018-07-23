import React, {Component} from 'react';
import Slides from '../components/Slides';
import Expo, {AppLoading} from 'expo';
import {AsyncStorage} from 'react-native'
import _ from 'lodash'

const SLIDE_DATA=[
    {text:'Welcome to Servify', color:'#FFB300'},
    {text:'Easy way to Find a Service Brought to your Home', color:'#00E676'},
    {text:'Post or Find Help from any Professional Registered', color:'#03A9F4'}
];

class WelcomeScreen extends Component{

    state ={
        loading : true,
        token : null
    };

    async componentWillMount(){
        //check if there is already a token
       await this.checkForToken();
       //Make sure to load the Native Base Fonts
       await this.loadFonts()
    }

    async checkForToken(){
        let token = await AsyncStorage.getItem('login_token');
        //check if there is a token to skip tutorial / auth
        if(token){
            //Navigate to HomeScreen
            this.props.navigation.navigate('main');
            
            this.setState({token})
        }else{
            this.setState({token:false})
        }
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
        this.props.navigation.navigate('auth')
    };

    render(){
        //if we are still loading font or we have not checked for token
        if(this.state.loading || _.isNull(this.state.token)){
            return (<AppLoading/>)
        }
        return(
            <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete}/>
        )
    }
}
export default WelcomeScreen;