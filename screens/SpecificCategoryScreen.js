import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';
import { getServicesCategory } from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
class SpecificCategoryScreen extends Component {
    async componentWillMount() {
        // TODO: get all the post for this service in firebase
        const { dbReference } = this.props.category;
        await this.props.getServicesCategory(dbReference);
        console.log(this.props.servicesList);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.dataSource = ds.cloneWithRows(this.props.servicesList);
    }

    onBackPress = () => {
        this.props.navigation.goBack(null);
    }

    renderServices(service) {
        return(
            <Text>{service.title}</Text>
        );
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.onBackPress(); }}>
                            <Icon name="arrow-back" style={{ color: 'black' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.props.category.title}</Title>
                    </Body>
                    <Right />
                </Header>
                    {/* <ListView
                        // contentContainerStyle={styles}
                        dataSource={this.dataSource}
                        renderRow={(service) => this.renderServices(service)}
                    /> */}
            </Container>

        );
    }
}

const mapStateToProps = (state) => ({
    category: state.selectedCategory.category,
    servicesList: state.getServiceResult.servicesList
});

export default connect(mapStateToProps, { getServicesCategory })(SpecificCategoryScreen);
