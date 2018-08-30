import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Container, Header, Body, Right, Button, Icon, Title, Text, Left, Content, Card, CardItem, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { MapView, Linking } from 'expo';
import { updateFavorite } from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
let currentFavorite = [];

class SpecificService extends Component {
    state={ isFav: false };

    componentWillMount = async () => {
        const { service } = this.props;
        const { favorites } = this.props;
        console.log(favorites);
        if(favorites){
            currentFavorite = favorites;
            currentFavorite.forEach(element => {
                if(element.title === service.title && element.category === service.category && element.description === service.description){
                    this.setState({ isFav: true });
                } 
            });
        } 
    }

    onBackPress = () => {
        this.props.navigation.goBack(null);
    }

    addFavorite = async (email) => {
        this.setState({ isFav: true });
        currentFavorite.push(this.props.service);
        await this.props.updateFavorite(email, currentFavorite);
    }

    removeFavorite = async (email) => {
        const { service } = this.props;
        this.setState({ isFav: false });
        currentFavorite.forEach((element, i) => {
            if(element.title === service.title && element.category === service.category && element.description === service.description){
                currentFavorite.splice(i, 1);
            }
        });
        await this.props.updateFavorite(email, currentFavorite);
    }

    favPressed = () => {
        const { email } = this.props.service;

        if(this.state.isFav){
            this.removeFavorite(email);
        } else {
            this.addFavorite(email);
        }
    }

    contactPressed = async () => {
        const { phone } = this.props.service;
        await Linking.openURL('tel:+1' + phone.replace(/\D/g, ''));
    }

	render() {
        const { service } = this.props;
        const { descriptionStyle, cardStyle, footerBarStyle, favIconStyle, mapStyle, subtitleStyle, infoStyle } = styles;
        const { latitude, longitude } = service.geolocation;
        const coords = { latitude, longitude };
        const meters = service.miles * 1609.34;
        let latitudeDelta = 0.0922;

        if(service.miles <= 3) {
            latitudeDelta = 0.0922;
        } else if (service.miles <= 10 && service.miles > 3) {
            latitudeDelta = 0.45;
        } else if (service.miles <= 30 && service.miles > 20){
            latitudeDelta = 0.8;
        } else if (service.miles <= 50 && service.miles > 30){
            latitudeDelta = 1.5;
        }

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'black' }} />
                        </Button>
                    </Left>
                    <Body style={styles.titleStyle}>
                        <Title>{service.title}</Title>
                    </Body>
                        
                    <Right>
                        <Button transparent title="Settings" onPress={() => this.favPressed()}>
                            <Icon type="MaterialIcons" name={this.state.isFav ? 'favorite' : 'favorite-border'} style={{ color: '#D84315' }} />
                        </Button>
                    </Right>
                </Header>

                <Content style={{ flex: 1, marginTop: 10 }}>
                    {/* TODO: Add Ratings */}
                    {/* <Text style={subtitleStyle}>Rating </Text> */}
                    <Text style={subtitleStyle}>Service Description </Text>
                    <Card style={cardStyle}>
                        <CardItem>
                            <Body>
                                <Text style={descriptionStyle}>{service.description}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Text style={subtitleStyle}>{service.location.city}, {service.location.region}</Text>
                    <MapView
                        style={mapStyle}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <MapView.Circle
                            center={coords}
                            radius={meters}
                            strokeColor="#FF7043"
                        />
                    </MapView>
                    <Text style={subtitleStyle}>Contact Information </Text>
                    <Card style={cardStyle}>
                        <CardItem>
                            <Body>
                                <Text style={infoStyle}>{service.email}</Text>
                                <Text style={infoStyle}>{service.phone}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    {/* TODO: Add Reviews */}
                    {/* <Text style={subtitleStyle}>Reviews </Text> */}
                    {/* TODO: Add a share fab button */}
                </Content>         

                <View style={{ bottom: 30, justifyContent: 'center', alignItems: 'center', left: '28%' }}>
                    <Button style={{ backgroundColor: '#FF7043', width: '43%' }} onPress={() => this.contactPressed()}>
                        <Text>Contact Now!</Text>
                        <Icon type="Feather" name="phone" style={{ color: 'white', fontSize: 18, left: -20, marginBottom: 5 }} />
                    </Button>
                </View>       
            </Container>
        );
	}
}
const styles = {
    titleStyle: {
        flex: 3
    },
    cardStyle: {
        width: '80%',
        marginLeft: '7%',
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        elevation: null
    },
    descriptionStyle: {
        fontSize: 16
    },
    subtitleStyle: {
        marginLeft: '7%',
        marginTop: 10,
        fontWeight: 'bold',
        color: '#4DB6AC',
        fontSize: 16
    },
    footerBarStyle: {
        position: 'absolute',
        bottom: 30
    },
    favIconStyle: {
    },
    categoryStyle: {
        marginLeft: '7%',
        marginTop: 10,
        color: '#FF7043'
    },
    mapStyle: {
        width: SCREEN_WIDTH - ((SCREEN_WIDTH * 7 / 100) * 2),
        height: 200,
        marginTop: 10,
        marginLeft: '7%'
    },
    infoStyle: {
        marginTop: 5,
        fontSize: 16
    }
};

const mapStateToProps = (state) => {
    return { 
        service: state.selectedService.service,
        favorites: state.favoriteServices
     };
};

export default connect(mapStateToProps, { updateFavorite })(SpecificService);
