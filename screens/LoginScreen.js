import React, {Component} from 'react';
import {Text, Form, Item, Button, Label, Input, Icon} from 'native-base';
import {LinearGradient} from 'expo';
import {View} from 'react-native';
class LoginScreen extends Component{ 
    render(){
        const {inputStyle,labelStyle,itemStyle,backIconStyle,formStyle,titleStyle} = styles;
        return(
            <LinearGradient colors={['#FF7043','#F4511E','#BF360C']} style={{flex:1}}>
                <Icon style={backIconStyle}
                      type={'Entypo'}
                      name={'chevron-thin-left'}
                      onPress={()=>{this.props.navigation.navigate('auth')}}
                />  

                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={titleStyle}>Sign in</Text>
                    <Form style={formStyle}>
                        <Item floatingLabel style={itemStyle}>
                            <Label style={labelStyle}>Email</Label>
                            <Input style={inputStyle}  />
                        </Item>
                        <Item floatingLabel style={itemStyle}>
                            <Label style={labelStyle}>Password</Label>
                            <Input style={inputStyle} />
                        </Item>

                    </Form>
                    <View>
                        <Button bordered light rounded style={{marginTop:40}}>
                            <Text>Log in</Text>
                        </Button>
                    </View>
                </View>
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
        top:35,
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

export default LoginScreen;