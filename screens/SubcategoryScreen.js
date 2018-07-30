import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, ListView, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Header, Body, Title, Container, Left, Button, Icon, Right } from 'native-base';
import { connect } from 'react-redux';

class SubcategoryScreen extends Component {
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
            <Title> Subcategories Title</Title>
          </Body>
          <Right />
         </Header>
        <Text>Subcategory</Text>
        <Text>Subcategory</Text>
        <Text>Subcategory</Text>
        <Text>Subcategory</Text>
        <Text>Subcategory</Text>
      </Container>
    );
  }
}

export default SubcategoryScreen;