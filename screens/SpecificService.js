import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Container, Header, Body, Right, Button, Icon, Title, Text, Left, Content } from 'native-base';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import { getCurrentUserDisplayName } from '../actions';

class SpecificService extends Component {

	// async componentWillMount() {

    // }

    onBackPress = () => {
        this.props.navigation.goBack(null);
    }

    renderService = () => {
        return (
            <Text> asd </Text>
        );
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
                        <Title style={styles.titleStyle}>{this.props.service.title}</Title>
                    <Right />
                </Header>
                <Content>
                    {this.renderService()}
                </Content>
                
            </Container>
        );
	}
}
const styles = {
    titleStyle: {
        alignItems: 'center',
        marginTop: '10%',
        fontSize: 20
    }
};

const mapStateToProps = (state) => {
    return { service: state.selectedService.service };
};

export default connect(mapStateToProps)(SpecificService);
