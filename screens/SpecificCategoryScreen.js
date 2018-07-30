import React, { Component } from 'react';
import { View } from 'react-native';
import { Header,Text, Card, CardItem, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';

class SpecificCategoryScreen extends Component {
  componentWillMount(){

  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => { this.props.navigation.navigate('browse'); }}>
              <Icon name="arrow-back" style={{ color: 'black' }} />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.selectedCategory.categoryTitle}</Title>
          </Body>
          <Right />
        </Header>
        <Text>Specific Category</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ selectedCategory: state.selectedCategory.category });

export default connect(mapStateToProps)(SpecificCategoryScreen);
