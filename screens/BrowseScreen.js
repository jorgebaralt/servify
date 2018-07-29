import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, ListView, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Header, Body, Title } from 'native-base';
import { connect } from 'react-redux';
import {selectCategory} from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
class BrowseScreen extends Component {
  componentWillMount(){
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(this.props.categories);
  }

  renderCategories(category){
        return (
          <TouchableOpacity 
            key={category.id} 
            style={styles.gridItem} 
            onPress={() => { this.props.selectCategory(category); }}
          >
            <Card style={styles.cardStyle}>
              <CardItem header>
                <Text>{category.categoryTitle}</Text>
              </CardItem>
            </Card>
          </TouchableOpacity>
      );
    }

  render() {
      return (
          <View style={{ flex: 1 }}>
          <Header>
          <Body>
            <Title>Categories</Title>
          </Body>
          </Header>
            <ListView 
              contentContainerStyle={styles.contentStyle}
              dataSource={this.dataSource}
              renderRow={(category) => this.renderCategories(category)}
            />    
          </View>
      );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  cardStyle: {
    height: 100
  },
  gridItem: {
    marginLeft: 10,
    marginTop: 10,
    width: SCREEN_WIDTH / 2 - 15,

  }
});

function mapStateToProps(state){
  return { categories: state.categories };
}

export default connect(mapStateToProps, { selectCategory })(BrowseScreen);
