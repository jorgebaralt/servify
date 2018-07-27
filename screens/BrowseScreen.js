import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Text, Content, Container, Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';

class BrowseScreen extends Component {
    renderCategories(){
      const { categories } = this.props;
      // console.log(categories[0].subcategories[0].subcategoryTitle);
      return categories.map((category) => {
          return (
          <Card key={category.id} style={{ height: 150 }}>
            <CardItem header>
              <Text>{category.categoryTitle}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Click on any carditem
                </Text>
              </Body>
            </CardItem>
          </Card>
        );
      });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
              <Content>
                {this.renderCategories()}
              </Content>
                    
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state){
  return { categories: state.categories };
}

export default connect(mapStateToProps)(BrowseScreen);
