import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Container, Header, Body, Right, Button, Icon, Title, Text, Left } from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import { getCurrentUserDisplayName } from '../actions';

class SpecificService extends Component {

	// async componentWillMount() {

    // }

    onBackPress = () => {
        this.props.navigation.goBack(null);
    }
      
	render() {
        return (
            <Container>
                <Header span>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'black' }} />
                        </Button>
                    </Left>
                        <Title style={{ alignItems: 'center' }}>Service</Title>
                    <Right />
                </Header>
            </Container>
        );
	}
}

export default connect(
	null,
)(SpecificService);
