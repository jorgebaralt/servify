import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { getServicesByEmail, selectService } from '../actions';

let item;
class ProfileServices extends Component {
    state={ dataLoaded: false }

    async componentWillMount() {
        let data;
        item = this.props.navigation.getParam('item');
        if (item.id === 'favorites') {
            data = this.props.favorites;
        } else if (item.id === 'my_services') {
            await this.props.getServicesByEmail(this.props.email);
            data = this.props.servicesList;
        }
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(data);
        if(this.dataSource){
            this.setState({ dataLoaded: true });
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    renderServices = (service) => {
        const { grayStyle, cardStyle, titleStyle, phoneLocationStyle } = styles;
        const displayDescription = service.description.substring(0, 30) + '...';
        return(
            <TouchableOpacity
                key={service.id}
                onPress={() => { 
                    this.props.selectService(service);
                    this.props.navigation.navigate('service'); 
                }}
            >
                <Card style={cardStyle}>
                        <CardItem header>
                            <Text style={titleStyle}>{service.title}</Text>
                        </CardItem>
                        <CardItem>
                            <Body style={phoneLocationStyle}>
                                <Text style={grayStyle}>{service.phone}</Text>
                                <Text style={[grayStyle, { marginLeft: '15%' }]}>{service.location.city}</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" style={{ color: '#FF7043' }} />
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={grayStyle}>{displayDescription}</Text>
                            </Body>
                        </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }

    renderListView = () => {
        if(this.state.dataLoaded){
            return(
                <ListView
                    style={{ marginTop: 10 }}
                    dataSource={this.dataSource}
                    renderRow={(service) => this.renderServices(service)}
                    enableEmptySections
                />
            );
        }
        return (<Spinner color='#FF7043' />);
    }

    render() {
        const { inputStyle, labelStyle, itemStyle, backIconStyle, formStyle, titleStyle } = styles;

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
                {this.renderListView()}
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

function mapStateToProps(state){
    return { 
        favorites: state.favoriteServices,
        servicesList: state.getServiceResult.servicesList,
        email: state.auth.email
     };
}

export default connect(mapStateToProps, { getServicesByEmail, selectService })(ProfileServices);
