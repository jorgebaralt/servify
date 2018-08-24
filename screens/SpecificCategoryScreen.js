import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { getServicesCategory, selectService } from '../actions';


const SCREEN_WIDTH = Dimensions.get('window').width;
class SpecificCategoryScreen extends Component {
    state={ dataLoaded: false }

    componentWillMount = async () => {
        // TODO: get all the post for this service in firebase
        const { dbReference } = this.props.category;
        await this.props.getServicesCategory(dbReference);
        const { servicesList } = this.props;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(servicesList);
        if(this.dataSource){
            this.setState({ dataLoaded: true });
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack(null);
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
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body style={phoneLocationStyle}>
                                <Text style={grayStyle}>{service.phone}</Text>
                                <Text style={[grayStyle, { marginLeft: '15%' }]}>{service.location.city}</Text>
                            </Body>
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

    renderListView(){
        if(this.state.dataLoaded){
            return(
                <ListView
                    dataSource={this.dataSource}
                    renderRow={(service) => this.renderServices(service)}
                    enableEmptySections
                />
            );
        }
        return (<Spinner color="orange" />);
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.props.category.color[0] }}>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>{this.props.category.title}</Title>
                    </Body>
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
        fontSize: 18
    },
    phoneLocationStyle: {
        flexDirection: 'row',
        flex: 1,
    }

};

const mapStateToProps = (state) => ({
    category: state.selectedCategory.category,
    servicesList: state.getServiceResult.servicesList
});

export default connect(mapStateToProps, { getServicesCategory, selectService })(SpecificCategoryScreen);
