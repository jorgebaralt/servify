import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text, Content, Container, Card, CardItem, Body } from 'native-base';

class BrowseScreen extends Component {
    renderCategories(){
      return(
        <View>
            <Text>Hello</Text>
        </View>
      );
    }

    render() {
        return (
            <SafeAreaView>
                    {this.renderCategories()}

            </SafeAreaView>
        );
    }
}

export default BrowseScreen;
