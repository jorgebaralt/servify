import React, {Component} from 'react'
import {View,TouchableOpacity} from 'react-native'
import {connect} from 'react-redux';
import {facebookLogin} from "../actions";
import {Button,Text,Icon} from 'native-base';
import {LinearGradient} from 'expo'
class AuthScreen extends Component{
    render(){
        return(
            <LinearGradient colors={['#FF7043','#F4511E','#BF360C']} style={{flex:1}}>

                <View style={styles.authStyle}>
                    <Text style={{fontSize:40, color: 'white', marginBottom:100, fontWeight:'bold'}}>Servify</Text>

                    <View style={styles.buttonStyle}>
                        <Button bordered light rounded title={'Servify'} onPress={()=>{this.props.navigation.navigate('createAccount')}}>
                            <Text style={styles.textStyle}> Create Account With Email</Text>
                        </Button>
                    </View>

                    <View style={styles.buttonStyle}>
                        <Button bordered light rounded  title={'Facebook'}>
                            <Text style={styles.textStyle}> <Icon style={{color:'white',fontSize:16,marginRight:10}} type={'Entypo'} name={'facebook'}/> Log in with Facebook</Text>
                        </Button>
                    </View>
                </View>

                <TouchableOpacity
                    style={{position:'absolute', bottom:30, right:30}}
                    // onPress={} Navigate to Login Screen
                >
                    <Text style={{fontSize:16, color: 'white'}} onPress={()=>{this.props.navigation.navigate('login')}} >Login</Text>
                </TouchableOpacity>

            </LinearGradient>
        )
    }
}

const styles={
    authStyle:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle:{
        marginBottom:30
    },
    textStyle:{
        fontSize:16
    }
};

export default connect(null,{facebookLogin})(AuthScreen);