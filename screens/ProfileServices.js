import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right, Spinner } from 'native-base';
import { connect } from 'react-redux';

class ProfileServices extends Component {
    onBackPress = () => {
        this.props.navigation.goBack();
    }

    renderListView = (item) => {
        console.log(item);
    }

    render() {
        const { inputStyle, labelStyle, itemStyle, backIconStyle, formStyle, titleStyle } = styles;
        const item = this.props.navigation.getParam('item');

        return (
            <Container>
                <Header style={{ backgroundColor: '#FF7043' }}>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: 'white' }}> {item.title} </Title>
                    </Body>
                    <Right />
                </Header>
                {this.renderListView(item)}
            </Container>
        );
    }
}

const styles = {
    headerStyle: {
        
    },
    cardStyle: {
        width: '80%',
        marginLeft: '10%',
        marginTop: '2.5%',
    },
    contentStyle: {

    },
    grayStyle: {
        color: 'gray'
    },
    titleStyle: {
        fontSize: 18,
    },
    phoneLocationStyle: {
        flexDirection: 'row',
        flex: 1,
    },
    headerTitleStyle: {
        color: 'white'
    }
};

export default ProfileServices;