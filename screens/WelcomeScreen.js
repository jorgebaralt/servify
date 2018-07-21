import React, {Component} from 'react';
import Slides from '../components/Slides';
import Expo, {AppLoading} from 'expo';

const SLIDE_DATA=[
    {text:'Welcome to Servify', color:'#FFB300'},
    {text:'Easy way to Find a Service Brought to your Home', color:'#00E676'},
    {text:'Post or Find Help from any Professional Registered', color:'#03A9F4'}
];

class WelcomeScreen extends Component{

    state ={loading : true};

    async componentWillMount(){
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
        if(this.state.loading){
            return (<AppLoading/>)
        }
        return(
            <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete}/>
        )
    }
}
export default WelcomeScreen;