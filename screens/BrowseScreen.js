import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Content, Container, Card, CardItem, Body } from 'native-base';

class BrowseScreen extends Component {
    renderCategories(){
      return(
        <View>
            <Text> Hello </Text>
        </View>
      );
    }

    render() {
        return (
            <Container>
                <Content>
                    {this.renderCategories()}
                </Content>
            </Container>
        );
    }
}

export default BrowseScreen;