import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { Text, Card, CardItem, Button, Icon } from 'native-base';

class EmptyListMessage extends Component{
    render(){
        const { iconStyle, cardStyle, titleStyle, descriptionStyle, buttonStyleiOS, buttonStyleAndroid } = styles;
        return (
            <View>
                    <Card bordered={false} style={cardStyle}>
                        <CardItem>
                            <Icon name="emoji-sad" type="Entypo" style={iconStyle} />
                        </CardItem>
                        <CardItem>
                            <Text style={titleStyle}>Oops!</Text>
                        </CardItem>
                        <CardItem>
                            <Text style={descriptionStyle}>{this.props.children}</Text>
                        </CardItem>
                    </Card>
                    <View style={Platform.OS === 'android' ? buttonStyleAndroid : buttonStyleiOS}>
                        <Button style={{ backgroundColor: '#C62828' }} onPress={this.props.buttonPress}>
                                <Text>Go Back!</Text>
                        </Button>
                    </View>
            </View>
        ); 
    }
} 

const styles = {
    iconStyle: {
        fontSize: 100,
        flex: 1,
        color: '#C62828', 
        textAlign: 'center'
    },
    cardStyle: {
        top: '5%',
        marginLeft: '5%',
        width: '90%',
        height: '80%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        marginTop: '10%'
    },
    descriptionStyle: {
        fontSize: 16,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        marginTop: '10%'
    },
    buttonStyleiOS: {
        position: 'absolute',
        top: '82%',
        alignItems: 'center',
        left: '37%'
    },
    buttonStyleAndroid: {
        left: '37%'
    }
};

export default(EmptyListMessage);
