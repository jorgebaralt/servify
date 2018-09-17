import React, { Component } from 'react';
import { Container, Header, Body, Right, Button, Icon, Title, Text, Left, Content } from 'native-base';
import { connect } from 'react-redux';

class EditService extends Component {

    render() {
        return (
            <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => { this.props.navigation.goBack(); }}>
                                <Icon name="arrow-back" style={{ color: 'black' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Edit Your Service</Title>
                        </Body>
                        <Right />
                    </Header>
            </Container>
        );
    }
}

export default EditService;
