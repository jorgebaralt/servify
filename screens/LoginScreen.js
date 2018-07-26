import React, {Component} from 'react';
import {Text, Form, Item, Button, Label, Input, Icon,Toast,Content} from 'native-base';
import {LinearGradient} from 'expo';
import {View,SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {emailAndPasswordLogin} from '../actions';
const initialState={
    email:'',
    password:'',
    showToast:false
};
class LoginScreen extends Component{ 
    
    state=initialState;

    loginUser=async ()=>{
        const {email,password} = this.state;
        await this.props.emailAndPasswordLogin(email,password);
        this.clearState();
    };

    componentWillUpdate(nextProps){
        const {displayName,message} = nextProps;
        if(displayName){
            this.props.navigation.navigate('main');
            Toast.show({
                text: 'Welcome ' + displayName,
                duration: 2000,
                type:'success'
              })
        }
        if(message){
            Toast.show({
                text: message,
                buttonText: "Okay",
                duration: 5000,
                type:'warning'
              })
        }
    }

    clearState(){
        this.setState(initialState);
    }
    render(){
        const {inputStyle,labelStyle,itemStyle,backIconStyle,formStyle,titleStyle} = styles;
        return(
            <LinearGradient colors={['#FF7043','#F4511E','#BF360C']} style={{flex:1}}>

                <SafeAreaView style={{flex:1}}>
                    <Icon style={backIconStyle}
                          type={'Entypo'}
                          name={'chevron-thin-left'}
                          onPress={()=>{this.props.navigation.navigate('auth')}}
                    />
                    <Content>
                        {/*//Login Form*/}
                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={titleStyle}>Sign in</Text>
                            <Form style={formStyle}>
                                <Item floatingLabel style={itemStyle}>
                                    <Label style={labelStyle}>Email</Label>
                                    <Input style={inputStyle} value={this.state.email} onChangeText={(email)=>{this.setState({email})}} />
                                </Item>
                                <Item floatingLabel style={itemStyle}>
                                    <Label style={labelStyle}>Password</Label>
                                    <Input style={inputStyle} value={this.state.password} secureTextEntry onChangeText={(password)=>this.setState({password})} />
                                </Item>

                            </Form>
                            <View>
                                <Button title={'Login User'} bordered light rounded style={{marginTop:40}} onPress={this.loginUser}>
                                    <Text>Log in</Text>
                                </Button>
                            </View>
                        </View>
                    </Content>
                </SafeAreaView>
            </LinearGradient>
        )
    }
}

const styles={
    inputStyle:{
        color:'white',
        width:'10%'
    },
    labelStyle:{
        color:'white'
    },
    itemStyle:{
        margin:10
    },
    backIconStyle:{
        color:'white',
        top:3,
        left:0,
        marginBottom:40
    },
    formStyle:{
        width:'80%'
    },
    titleStyle:{
        color:'white',
        fontWeight:'bold',
        fontSize:30,
        margin:10
    }
};

function mapStateToProps(state){
    return{
        displayName: state.auth.displayName,
        message: state.auth.message
    }
}

export default connect(mapStateToProps,{emailAndPasswordLogin})(LoginScreen);