import React, {Component} from 'react'
import {Text, Form, Item,Input,Icon,Label,Toast,Button,Content} from 'native-base'
import {LinearGradient} from 'expo';
import {View, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native';
import {connect} from 'react-redux';
import {createEmailAccount} from '../actions';
const initialState={
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    showToast:false
};
class CreateAccountScreen extends Component{

    state=initialState;

    createAccount= async ()=>{
        const {firstName,lastName,email,password} = this.state;
        const user = {
            firstName,
            lastName,
            email,
            password
        };
        await this.props.createEmailAccount(user);
        this.clearState();
    };
    
    //when we receive new props, instantly: 
    componentWillUpdate(nextProps){
        const {message,displayName} = nextProps;

        if(displayName){
            this.props.navigation.navigate('home');
            Toast.show({
                text: 'Welcome ' + displayName,
                buttonText: "OK",
                duration: 3000,
                type:'success'
              })
        }
        if(message){
            Toast.show({
                text: message,
                buttonText: "OK",
                duration: 5000,
                type:'warning'
              })
        }
    }

    clearState(){
        this.setState(initialState)
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
                <KeyboardAvoidingView behavior={Platform.OS==='android' ? 'padding' : null} style={{flex:1,justifyContent:'center'}} >
                <Content>
                    <View style={{flex:1,alignItems:'center'}}>
                    <Text style={titleStyle}>Sign up</Text>
                    <Form style={formStyle}>
                        <Item floatingLabel style={itemStyle}>
                             <Label style={labelStyle}>First Name</Label>
                             <Input style={inputStyle} value={this.state.firstName} onChangeText={firstName=>{this.setState({firstName})}}/>
                        </Item>
                        <Item floatingLabel style={itemStyle}>
                             <Label style={labelStyle}>Last Name</Label>
                             <Input style={inputStyle} value={this.state.lastName} onChangeText={lastName => {this.setState({lastName})}}/>
                        </Item>
                        <Item floatingLabel style={itemStyle}>
                             <Label style={labelStyle}>Email</Label>
                             <Input style={inputStyle} value={this.state.email} onChangeText={email=>{this.setState({email})}} />
                        </Item>
                        <Item floatingLabel style={itemStyle}>
                             <Label style={labelStyle}>Password</Label>
                             <Input style={inputStyle}  secureTextEntry value={this.state.password} onChangeText={password=>{this.setState({password})}} />
                        </Item>
                    </Form>
                        <View>
                            <Button bordered light rounded style={{marginTop:40}} onPress={this.createAccount}>
                                <Text>Create Account</Text>
                            </Button>
                        </View>

                    </View>
                </Content>
                </KeyboardAvoidingView>
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
        paddingBottom:20
    },
    formStyle:{
        width:'80%',
        alignItems:'center'
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
        displayName:state.auth.displayName,
        message: state.auth.message
    };
}

export default connect(mapStateToProps,{createEmailAccount})(CreateAccountScreen);