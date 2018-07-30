import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';

class SpecificCategoryScreen extends Component {
  componentWillMount(){
    // TODO: get all the post for this service in firebase
  }

  onBackPressed = () =>{
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.onBackPressed()}>
              <Icon name="arrow-back" style={{ color: 'black' }} />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.subcategory.title}</Title>
          </Body>
        </Header>
        <Text>Specific Category</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ subcategory: state.selectedCategory.subcategory });

export default connect(mapStateToProps)(SpecificCategoryScreen);
