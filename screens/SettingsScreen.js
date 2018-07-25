import React, { Component } from 'react';
import { Container, Header, Body, Right, Button, Icon, Title,Text,Left} from 'native-base';
import {connect} from 'react-redux';
import {logOut} from "../actions";


class SettingsScreen extends Component {
    doLogOut = async () => {
        console.log('perform sign out');
        this.props.logOut(()=>{this.props.navigation.navigate('auth')});
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent >
                            <Icon name='arrow-back' style={{color:'black'}}/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Settings</Title>
                    </Body>
                    <Right/>
                </Header>
                <Button block danger title={'log out'} onPress={this.doLogOut}>
                    <Text>Log out</Text>
                </Button>
            </Container>
        );
    }
}

export default connect(null,{logOut})(SettingsScreen);