import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, ListView, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Header, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { deselectCategory, selectSubcategory } from '../actions';

class SubcategoriesListScreen extends Component {
    componentWillMount() {
        const { subcategories } = this.props.category;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(subcategories);
    }

    onBackPressed = () => {
        this.props.deselectCategory();
        this.props.navigation.goBack('browse');
    };

    doSelectSubcategory = (subcategory) => {
        this.props.selectSubcategory(subcategory);
        this.props.navigation.navigate('servicesList');
    };

    renderSubcategories = (subcategory) => {
        return (
            <TouchableOpacity
            key={subcategory.id}
            onPress={() => this.doSelectSubcategory(subcategory)}
            >
                <Card style={styles.cardStyle}>
                    <CardItem header>
                        <Text>{subcategory.title}</Text>
                        <Right>
                            <Icon name="arrow-forward" style={{ color: this.props.category.color[0] }} />
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{subcategory.description}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: this.props.category.color[0] }}>
                        <Left> 
                            <Button transparent onPress={() => { this.props.navigation.navigate('browse'); }}>
                                <Icon name="arrow-back" style={{ color: 'white' }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Title style={{ color: 'white' }}>{this.props.category.title}</Title>
                        </Body>
                        <Right />
                </Header>
                <ListView
                    style={{ marginTop: 10 }}
                    contentContainerStyle={styles.contentStyle}
                    dataSource={this.dataSource}
                    renderRow={(subcategory) => this.renderSubcategories(subcategory)}
                />
            </Container>
        );
    }
}

const styles = {
    cardStyle: {
        width: '80%',
        marginLeft: '10%',
        marginTop: '2.5%'
    },
    contentStyle: {

    }
};
const mapStateToProps = (state) => ({ category: state.selectedCategory.category });
export default connect(mapStateToProps, { deselectCategory, selectSubcategory })(SubcategoriesListScreen);
