import React, { Component } from 'react';
import { View } from 'react-native';
import { Header,Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';

class SpecificCategoryScreen extends Component {
  componentWillMount(){
    // TODO: get all the post for this service in firebase
  }

  onBackPress = () => {
    this.props.navigation.goBack(null);
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
        <Text>Specific Category</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ category: state.selectedCategory.category });

export default connect(mapStateToProps)(SpecificCategoryScreen);
