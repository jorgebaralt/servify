import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Content, Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right, Spinner } from 'native-base';
import { connect } from 'react-redux';

class Feedback extends Component {
    onBackPress = () => {
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'black' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Feedback</Title>
                    </Body>
                    <Right />
                </Header>
            </Container>
        );
    }
}

const styles = {

};

export default connect(null)(Feedback);
